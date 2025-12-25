import { Effect } from "effect";
import * as Http from "@effect/platform/HttpServer";
import * as S from "@effect/schema/Schema";
import { Create{{EntityName}}Input, Update{{EntityName}}Input, ErrorResponse } from "{{packageScope}}/shared";
import { {{EntityName}}Repository } from "../services/{{EntityName}}Repository.js";
import { {{EntityName}}NotFoundError, ValidationError } from "./errors.js";

/**
 * Helper: Parse and validate request body with Effect Schema
 */
const parseBody = <A, I, R>(schema: S.Schema<A, I, R>) =>
  (request: Http.request.ServerRequest) =>
    Effect.gen(function* () {
      const body = yield* request.json;
      return yield* S.decodeUnknown(schema)(body).pipe(
        Effect.mapError(
          (error) =>
            new ValidationError({
              message: "Invalid request body",
              issues: error,
            })
        )
      );
    });

/**
 * Helper: Create JSON response
 */
const jsonResponse = <A>(data: A, status: number = 200) =>
  Http.response.json(data, {
    status,
    headers: Http.headers.fromInput({
      "Content-Type": "application/json",
    }),
  });

/**
 * Helper: Map errors to HTTP responses
 */
const handleErrors = <E, A>(effect: Effect.Effect<A, E>) =>
  effect.pipe(
    Effect.catchTags({
      {{EntityName}}NotFoundError: (error) =>
        Effect.succeed(
          jsonResponse(
            { error: `{{EntityName}} with id ${error.id} not found` } satisfies ErrorResponse,
            404
          )
        ),
      ValidationError: (error) =>
        Effect.succeed(
          jsonResponse(
            {
              error: error.message,
              details: error.issues,
            } satisfies ErrorResponse,
            400
          )
        ),
    }),
    Effect.catchAll((error) =>
      Effect.succeed(
        jsonResponse(
          {
            error: "Internal server error",
            details: String(error),
          } satisfies ErrorResponse,
          500
        )
      )
    )
  );

/**
 * Main HTTP router
 */
export const RouterLive = Http.router.empty.pipe(
  // GET /health
  Http.router.get(
    "/health",
    Effect.gen(function* () {
      return jsonResponse({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "{{appName}}-api",
      });
    })
  ),

  // GET /{{entityNamePlural}}
  Http.router.get(
    "/{{entityNamePlural}}",
    Effect.gen(function* () {
      const repo = yield* {{EntityName}}Repository;
      const {{entityNamePlural}} = yield* repo.getAll;
      return jsonResponse({{entityNamePlural}});
    }).pipe(handleErrors)
  ),

  // POST /{{entityNamePlural}}
  Http.router.post(
    "/{{entityNamePlural}}",
    Effect.gen(function* () {
      const request = yield* Http.request.ServerRequest;
      const repo = yield* {{EntityName}}Repository;

      const input = yield* parseBody(Create{{EntityName}}Input)(request);
      const {{entityName}} = yield* repo.create(input);

      return jsonResponse({{entityName}}, 201);
    }).pipe(handleErrors)
  ),

  // GET /{{entityNamePlural}}/:id
  Http.router.get(
    "/{{entityNamePlural}}/:id",
    Effect.gen(function* () {
      const request = yield* Http.request.ServerRequest;
      const repo = yield* {{EntityName}}Repository;
      const id = request.params.id;

      const {{entityName}} = yield* repo.getById(id);
      return jsonResponse({{entityName}});
    }).pipe(handleErrors)
  ),

  // PATCH /{{entityNamePlural}}/:id
  Http.router.patch(
    "/{{entityNamePlural}}/:id",
    Effect.gen(function* () {
      const request = yield* Http.request.ServerRequest;
      const repo = yield* {{EntityName}}Repository;
      const id = request.params.id;

      const updates = yield* parseBody(Update{{EntityName}}Input)(request);
      const {{entityName}} = yield* repo.update(id, updates);

      return jsonResponse({{entityName}});
    }).pipe(handleErrors)
  ),

  // DELETE /{{entityNamePlural}}/:id
  Http.router.delete(
    "/{{entityNamePlural}}/:id",
    Effect.gen(function* () {
      const request = yield* Http.request.ServerRequest;
      const repo = yield* {{EntityName}}Repository;
      const id = request.params.id;

      yield* repo.delete(id);
      return Http.response.empty({ status: 204 });
    }).pipe(handleErrors)
  ),

  // OPTIONS /* - CORS preflight
  Http.router.options(
    "/*",
    Effect.succeed(
      Http.response.empty({
        status: 204,
        headers: Http.headers.fromInput({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }),
      })
    )
  )
);