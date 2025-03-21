import { showError } from "./toastUtils";

export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

export type ErrorType = "info" | "warning" | "error";

export const getErrorTypeFromStatus = (status: number): ErrorType => {
  if (status >= 500) return "error";
  if (status >= 400) return "warning";
  return "info";
};

export const getErrorMessageFromStatus = (status: number): string => {
  switch (status) {
    case 400:
      return "Invalid request";
    case 401:
      return "Please login to access this resource";
    case 403:
      return "You do not have permission to access this resource";
    case 404:
      return "Resource not found";
    case 409:
      return "Conflict with the current state of the resource";
    case 429:
      return "Too many requests, please try again later";
    case 500:
      return "Internal server error";
    case 503:
      return "Service unavailable";
    default:
      return status >= 500 ? "A server error occurred" : "An error occurred";
  }
};

export const handleError = async (
  error: unknown,
  retryFn?: () => Promise<void>
): Promise<void> => {
  let errorMessage = "An error occurred";
  let details: string | undefined;

  if (error instanceof HttpError) {
    errorMessage = error.message;
    details =
      typeof error.data === "object" && error.data !== null
        ? ((error.data as Record<string, unknown>).message as string) ||
          JSON.stringify(error.data)
        : undefined;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    details = error.stack;
  }

  if (error instanceof TypeError && error.message === "Failed to fetch") {
    errorMessage = "Unable to connect to the server";
    details = "Please check your internet connection";
  }

  showError(
    errorMessage,
    details,
    retryFn
      ? () => {
          void retryFn();
        }
      : undefined
  );

  console.error("[Error Handler]", error);

  throw error;
};
