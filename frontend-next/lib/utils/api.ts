"use client";

import { appConfig } from "@/lib/config";
import { clearAuth } from "@/lib/utils/hooks";

type Method = "GET" | "POST" | "DELETE";

export interface ApiError extends Error {
  status: number;
  errors?: Array<{ field: string; error: string }>;
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof Error && "status" in error;

const request = async <T = unknown>(
  url: string,
  method: Method,
  data?: unknown,
): Promise<T> => {
  const token = localStorage.getItem("token");
  const body = data === undefined ? undefined : JSON.stringify(data);
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const response = await fetch(
    `${appConfig.API_URL.replace(/\/$/, "")}${url}`,
    { method, headers, body },
  );

  if (!response.ok) {
    const payload = (await response
      .json()
      .catch(() => null)) as Partial<ApiError> | null;
    const error = new Error(
      payload?.message || response.statusText || `HTTP ${response.status}`,
    ) as ApiError;
    error.status = response.status;
    if (Array.isArray(payload?.errors)) error.errors = payload.errors;
    if (response.status === 401 && token) {
      clearAuth();
      window.location.reload();
    }
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};

export const clientApi = {
  get: <T = unknown>(url: string) => request<T>(url, "GET"),
  post: <T = unknown>(url: string, data?: unknown) =>
    request<T>(url, "POST", data),
  delete: <T = unknown>(url: string, data?: unknown) =>
    request<T>(url, "DELETE", data),
};
