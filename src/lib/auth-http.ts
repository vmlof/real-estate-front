export class AuthError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function responseError(response: Response): Promise<AuthError> {
  const body = await readBody(response);

  if (response.status === 429)
    return new AuthError(
      429,
      "Too many attempts. Please wait a minute before trying again.",
    );

  if (response.status >= 500)
    return new AuthError(
      response.status,
      "Service temporarily unavailable. Please try again.",
    );

  if (body && typeof body === "object") {
    const data = body as Record<string, unknown>;

    if (data.errors && typeof data.errors === "object") {
      const messages = Object.values(data.errors)
        .flat()
        .filter((v) => typeof v === "string");

      if (messages.length)
        return new AuthError(response.status, messages.join(" "));
    }

    for (const key of ["description", "detail", "title"]) {
      if (typeof data[key] === "string")
        return new AuthError(response.status, data[key]);
    }
  }

  return new AuthError(
    response.status,
    response.status === 401
      ? "Invalid session or incorrect credentials. Please log in again."
      : "The request could not be completed.",
  );
}

export function authErrorMessage(error: unknown): string {
  return error instanceof AuthError
    ? error.message
    : "We were unable to connect to the service. Please try again.";
}
