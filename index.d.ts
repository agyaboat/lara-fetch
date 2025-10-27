export function laraFetch(
  path: string,
  options?: RequestInit,
  host?: string | null,
  csrfPath?: string | null,
  debug?: boolean
): Promise<Response>;

export function laraCsrf(
  csrfPath?: string,
  host?: string | null,
  debug?: boolean
): Promise<Response>;
