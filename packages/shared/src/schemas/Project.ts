import { Schema as S } from "effect";

/**
 * Project entity schema
 * Used for both database storage and API responses
 */
export const Project = S.Struct({
  id: S.String.pipe(S.minLength(1)),
  title: S.String.pipe(S.minLength(1), S.maxLength(200)),
  description: S.String.pipe(S.maxLength(1000)),
  longDescription: S.optional(S.String.pipe(S.maxLength(5000))),
  technologies: S.Array(S.String),
  category: S.Literal(
    "web-development",
    "backend",
    "infrastructure",
    "data-science",
    "mobile",
    "iot",
    "other"
  ),
  status: S.Literal("completed", "in-progress", "archived"),
  startDate: S.String, // ISO 8601 date string
  endDate: S.optional(S.String), // ISO 8601 date string
  githubUrl: S.optional(S.String),
  liveUrl: S.optional(S.String),
  imageUrl: S.optional(S.String),
  highlights: S.Array(S.String),
  featured: S.Boolean,
  createdAt: S.String, // ISO 8601 date string
  updatedAt: S.String, // ISO 8601 date string
});

export type Project = S.Schema.Type<typeof Project>;

/**
 * CreateProjectInput - for POST /projects
 * No id, createdAt, or updatedAt (server-generated)
 */
export const CreateProjectInput = S.Struct({
  title: S.String.pipe(S.minLength(1), S.maxLength(200)),
  description: S.String.pipe(S.maxLength(1000)),
  longDescription: S.optional(S.String.pipe(S.maxLength(5000))),
  technologies: S.Array(S.String),
  category: S.Literal(
    "web-development",
    "backend",
    "infrastructure",
    "data-science",
    "mobile",
    "iot",
    "other"
  ),
  status: S.Literal("completed", "in-progress", "archived"),
  startDate: S.String,
  endDate: S.optional(S.String),
  githubUrl: S.optional(S.String),
  liveUrl: S.optional(S.String),
  imageUrl: S.optional(S.String),
  highlights: S.Array(S.String),
  featured: S.optional(S.Boolean).pipe(S.withDecodingDefault(() => false)),
});

export type CreateProjectInput = S.Schema.Type<typeof CreateProjectInput>;

/**
 * UpdateProjectInput - for PATCH /projects/:id
 * All fields optional for partial updates
 */
export const UpdateProjectInput = S.partial(
  S.Struct({
    title: S.String.pipe(S.minLength(1), S.maxLength(200)),
    description: S.String.pipe(S.maxLength(1000)),
    longDescription: S.String.pipe(S.maxLength(5000)),
    technologies: S.Array(S.String),
    category: S.Literal(
      "web-development",
      "backend",
      "infrastructure",
      "data-science",
      "mobile",
      "iot",
      "other"
    ),
    status: S.Literal("completed", "in-progress", "archived"),
    startDate: S.String,
    endDate: S.String,
    githubUrl: S.String,
    liveUrl: S.String,
    imageUrl: S.String,
    highlights: S.Array(S.String),
    featured: S.Boolean,
  })
);

export type UpdateProjectInput = S.Schema.Type<typeof UpdateProjectInput>;

/**
 * API Response wrappers
 */
export const ProjectListResponse = S.Array(Project);
export type ProjectListResponse = S.Schema.Type<typeof ProjectListResponse>;

export const ErrorResponse = S.Struct({
  error: S.String,
  details: S.optional(S.Unknown),
});
export type ErrorResponse = S.Schema.Type<typeof ErrorResponse>;
