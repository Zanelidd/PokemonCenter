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

