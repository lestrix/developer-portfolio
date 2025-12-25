import { Schema as S } from "effect";

/**
 * {{EntityName}} entity schema
 * Used for both database storage and API responses
 *
 * TEMPLATE INSTRUCTIONS:
 * 1. Rename this file from Entity.template.ts to {{EntityName}}.ts
 * 2. Replace {{EntityName}} with your entity name (e.g., Todo, Post, User)
 * 3. Update the fields below to match your domain model
 * 4. Keep the id and createdAt fields (required for DynamoDB)
 */
export const {{EntityName}} = S.Struct({
  id: S.String.pipe(S.minLength(1)),
  // Add your entity-specific fields here
  // Example: title: S.String.pipe(S.minLength(1), S.maxLength(200)),
  // Example: status: S.Literal("active", "inactive"),
  // Example: count: S.Number.pipe(S.int(), S.greaterThanOrEqualTo(0)),
  createdAt: S.String, // ISO 8601 date string
});

export type {{EntityName}} = S.Schema.Type<typeof {{EntityName}}>;

/**
 * Create{{EntityName}}Input - for POST /{{entityNamePlural}}
 * No id or createdAt (server-generated)
 */
export const Create{{EntityName}}Input = S.Struct({
  // Add fields required for creation
  // Example: title: S.String.pipe(S.minLength(1), S.maxLength(200)),
});

export type Create{{EntityName}}Input = S.Schema.Type<typeof Create{{EntityName}}Input>;

/**
 * Update{{EntityName}}Input - for PATCH /{{entityNamePlural}}/:id
 * All fields optional for partial updates
 */
export const Update{{EntityName}}Input = S.partial(
  S.Struct({
    // Add fields that can be updated
    // Example: title: S.String.pipe(S.minLength(1), S.maxLength(200)),
  })
);

export type Update{{EntityName}}Input = S.Schema.Type<typeof Update{{EntityName}}Input>;

/**
 * API Response wrappers
 */
export const {{EntityName}}ListResponse = S.Array({{EntityName}});
export type {{EntityName}}ListResponse = S.Schema.Type<typeof {{EntityName}}ListResponse>;

export const ErrorResponse = S.Struct({
  error: S.String,
  details: S.optional(S.Unknown),
});
export type ErrorResponse = S.Schema.Type<typeof ErrorResponse>;
