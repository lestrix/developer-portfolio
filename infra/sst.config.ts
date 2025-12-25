/// <reference path="./.sst/platform/config.d.ts" />

/**
 * SST Infrastructure Configuration
 *
 * This defines:
 * - Lambda function (backend API)
 * - Static site (frontend SPA)
 * - Environment-specific settings
 */
export default $config({
  app(input) {
    return {
      name: "developer-portfolio",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "eu-central-1",
        },
      },
    };
  },
  async run() {
    // DynamoDB table for persistent storage
    const table = new sst.aws.Dynamo("PortfolioProjects", {
      fields: {
        id: "string",
      },
      primaryIndex: { hashKey: "id" },
    });

    // Backend Lambda function with public URL
    const api = new sst.aws.Function("Api", {
      handler: "../apps/backend/src/projects-handler.handler",
      runtime: "nodejs20.x",
      timeout: "30 seconds",
      memory: "1024 MB",
      url: {
        authorization: "none",  // Explicitly set public access
        cors: true,  // Enable CORS with default settings (allows all origins, methods, headers)
      },
      link: [table],
      environment: {
        NODE_ENV: $app.stage,
        LOG_LEVEL: $app.stage === "production" ? "info" : "debug",
        TABLE_NAME: table.name,
      },
      nodejs: {
        esbuild: {
          external: [
            "@aws-sdk/*"
          ],
          minify: false,
          sourcemap: true,
          bundle: true,
          platform: "node",
          target: "node20",
          format: "esm",
          mainFields: ["module", "main"],
        },
      },
    });

    // Explicitly add Lambda permissions for public function URL access
    // Lambda Function URLs require BOTH permissions for public access:
    // 1. lambda:InvokeFunctionUrl - for the function URL itself
    // 2. lambda:InvokeFunction - for the underlying function invocation
    // Without both, the function URL returns 403 Forbidden even with authorization: "none"
    new aws.lambda.Permission("ApiUrlPermission", {
      action: "lambda:InvokeFunctionUrl",
      function: api.name,
      principal: "*",
      functionUrlAuthType: "NONE",
    });

    new aws.lambda.Permission("ApiInvokePermission", {
      action: "lambda:InvokeFunction",
      function: api.name,
      principal: "*",
    });

    // Frontend static site
    const frontend = new sst.aws.StaticSite("Frontend", {
      path: "../apps/frontend",
      build: {
        command: "pnpm run build",
        output: "dist",
      },
      environment: {
        VITE_API_URL: api.url,
      },
      // Uncomment to add custom domain
      // domain: $app.stage === "production" ? "todo.yourdomain.com" : undefined,
    });

    // Outputs
    return {
      api: api.url,
      frontend: frontend.url,
    };
  },
});
