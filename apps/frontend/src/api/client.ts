import type { Project, CreateProjectInput, UpdateProjectInput } from "@portfolio/shared";

/**
 * Type-safe API client for Portfolio Projects
 * Uses shared types from @portfolio/shared to prevent drift
 */
const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(response.status, error.error || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  health: () => fetchJson<{ status: string; timestamp: string }>(`${API_BASE}/health`),

  getProjects: () => fetchJson<Project[]>(`${API_BASE}/projects`),

  getProject: (id: string) => fetchJson<Project>(`${API_BASE}/projects/${id}`),

  createProject: (input: CreateProjectInput) =>
    fetchJson<Project>(`${API_BASE}/projects`, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateProject: (id: string, updates: UpdateProjectInput) =>
    fetchJson<Project>(`${API_BASE}/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  deleteProject: (id: string) =>
    fetchJson<void>(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
    }),
};
