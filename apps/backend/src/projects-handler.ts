import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context as LambdaContext,
} from "aws-lambda";
import type { Project } from "@portfolio/shared";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

// DynamoDB setup
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "PortfolioProjects";

// Helper: Generate UUID
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Helper: JSON response
const jsonResponse = (data: any, statusCode: number = 200) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  },
  body: JSON.stringify(data),
});

/**
 * Complete CRUD Lambda handler for Portfolio Projects
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
  context: LambdaContext
): Promise<APIGatewayProxyResultV2> => {
  console.log("=== LAMBDA INVOCATION START ===");
  console.log("Request ID:", context.awsRequestId);
  console.log("Path:", event.rawPath);
  console.log("Method:", event.requestContext?.http?.method);
  console.log("Headers:", JSON.stringify(event.headers));
  console.log("Body:", event.body);

  try {
    const path = event.rawPath || "/";
    const method = event.requestContext?.http?.method || "GET";

    // Health check
    if (path === "/health" && method === "GET") {
      console.log("Health check requested");

      const scanResult = await dynamodb.send(new ScanCommand({
        TableName: TABLE_NAME,
        Select: "COUNT",
      }));

      return jsonResponse({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "portfolio-api",
        projectCount: scanResult.Count || 0,
      });
    }

    // GET /projects - List all projects (with optional filtering)
    if (path === "/projects" && method === "GET") {
      console.log("GET /projects - Scanning DynamoDB");

      const queryParams = event.queryStringParameters || {};
      const featured = queryParams.featured === "true";
      const category = queryParams.category;

      const result = await dynamodb.send(new ScanCommand({
        TableName: TABLE_NAME,
      }));

      let projects = result.Items || [];

      // Apply filters
      if (featured) {
        projects = projects.filter((p: any) => p.featured === true);
      }

      if (category) {
        projects = projects.filter((p: any) => p.category === category);
      }

      // Sort by startDate descending (newest first)
      projects.sort((a: any, b: any) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });

      console.log("GET /projects - Returning", projects.length, "projects");
      return jsonResponse(projects);
    }

    // POST /projects - Create new project
    if (path === "/projects" && method === "POST") {
      console.log("POST /projects - Creating new project");
      const body = event.body ? JSON.parse(event.body) : {};
      console.log("Request body:", body);

      // Validate required fields
      if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
        console.error("Invalid title:", body.title);
        return jsonResponse({ error: "Title is required and must be a non-empty string" }, 400);
      }

      if (!body.description || typeof body.description !== "string") {
        console.error("Invalid description:", body.description);
        return jsonResponse({ error: "Description is required" }, 400);
      }

      if (!Array.isArray(body.technologies)) {
        console.error("Invalid technologies:", body.technologies);
        return jsonResponse({ error: "Technologies must be an array" }, 400);
      }

      if (!Array.isArray(body.highlights)) {
        body.highlights = [];
      }

      const id = generateId();
      const now = new Date().toISOString();

      const project: Project = {
        id,
        title: body.title.trim(),
        description: body.description.trim(),
        longDescription: body.longDescription?.trim(),
        technologies: body.technologies,
        category: body.category || "other",
        status: body.status || "completed",
        startDate: body.startDate || now,
        endDate: body.endDate,
        githubUrl: body.githubUrl,
        liveUrl: body.liveUrl,
        imageUrl: body.imageUrl,
        highlights: body.highlights,
        featured: body.featured === true,
        createdAt: now,
        updatedAt: now,
      };

      await dynamodb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: project,
      }));

      console.log("Created project in DynamoDB:", project);
      return jsonResponse(project, 201);
    }

    // GET /projects/:id - Get single project
    const getProjectMatch = path.match(/^\/projects\/([^/]+)$/);
    if (getProjectMatch && method === "GET") {
      const id = getProjectMatch[1];
      console.log("GET /projects/" + id);

      const result = await dynamodb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }));

      if (!result.Item) {
        console.error("Project not found in DynamoDB:", id);
        return jsonResponse({ error: `Project with id ${id} not found` }, 404);
      }

      console.log("Found project:", result.Item);
      return jsonResponse(result.Item);
    }

    // PATCH /projects/:id - Update project
    if (getProjectMatch && method === "PATCH") {
      const id = getProjectMatch[1];
      console.log("PATCH /projects/" + id);

      const body = event.body ? JSON.parse(event.body) : {};
      console.log("Update body:", body);

      // Build update expression dynamically
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      const allowedFields = [
        'title', 'description', 'longDescription', 'technologies',
        'category', 'status', 'startDate', 'endDate',
        'githubUrl', 'liveUrl', 'imageUrl', 'highlights', 'featured'
      ];

      allowedFields.forEach(field => {
        if (body[field] !== undefined) {
          updateExpressions.push(`#${field} = :${field}`);
          expressionAttributeNames[`#${field}`] = field;
          expressionAttributeValues[`:${field}`] = body[field];
        }
      });

      // Always update updatedAt
      updateExpressions.push("#updatedAt = :updatedAt");
      expressionAttributeNames["#updatedAt"] = "updatedAt";
      expressionAttributeValues[":updatedAt"] = new Date().toISOString();

      if (updateExpressions.length === 1) { // Only updatedAt
        console.error("No valid fields to update");
        return jsonResponse({ error: "No valid fields to update" }, 400);
      }

      const result = await dynamodb.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }));

      if (!result.Attributes) {
        console.error("Project not found in DynamoDB:", id);
        return jsonResponse({ error: `Project with id ${id} not found` }, 404);
      }

      console.log("Updated project in DynamoDB:", result.Attributes);
      return jsonResponse(result.Attributes);
    }

    // DELETE /projects/:id - Delete project
    if (getProjectMatch && method === "DELETE") {
      const id = getProjectMatch[1];
      console.log("DELETE /projects/" + id);

      // Check if project exists before deleting
      const getResult = await dynamodb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }));

      if (!getResult.Item) {
        console.error("Project not found in DynamoDB:", id);
        return jsonResponse({ error: `Project with id ${id} not found` }, 404);
      }

      await dynamodb.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }));

      console.log("Deleted project from DynamoDB:", id);
      return jsonResponse(null, 204);
    }

    // OPTIONS - CORS preflight
    if (method === "OPTIONS") {
      console.log("OPTIONS request for:", path);
      return { statusCode: 204, headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }, body: "" };
    }

    // 404 - Route not found
    console.error("Route not found:", method, path);
    return jsonResponse({
      error: "Not Found",
      message: `Route ${method} ${path} not found`,
      availableRoutes: [
        "GET /health",
        "GET /projects",
        "GET /projects?featured=true",
        "GET /projects?category=web-development",
        "POST /projects",
        "GET /projects/:id",
        "PATCH /projects/:id",
        "DELETE /projects/:id",
      ],
    }, 404);

  } catch (error) {
    console.error("=== HANDLER ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error instanceof Error ? error.stack : "No stack trace");

    return jsonResponse({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : String(error),
      requestId: context.awsRequestId,
    }, 500);
  } finally {
    console.log("=== LAMBDA INVOCATION END ===");
  }
};
