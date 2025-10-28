export interface LaraConfig {
    baseURL?: string;
    csrfPath?: string;
    credentials?: RequestCredentials;
    debug?: boolean;
    defaultHeaders?: Record<string, string>;
    xsrfCookieName?: string;
}

export declare const config: Required<LaraConfig>;

export declare function laraConfigure(options?: LaraConfig): void;

export declare function laraCsrf(
    override?: LaraConfig
): Promise<void>;

export interface laraFetchOptions extends RequestInit {
    query?: Record<string, any>;
}

export declare function laraFetch(
    path: string,
    options?: laraFetchOptions,
    override?: LaraConfig
): Promise<Response>;

export declare namespace laraFetch {
  function get(
    path: string,
    options?: laraFetchOptions,
    override?: LaraConfig
  ): Promise<Response>;

  function post(
    path: string,
    options?: laraFetchOptions,
    override?: LaraConfig
  ): Promise<Response>;

  function put(
    path: string,
    options?: laraFetchOptions,
    override?: LaraConfig
  ): Promise<Response>;

  function patch(
    path: string,
    options?: laraFetchOptions,
    override?: LaraConfig
  ): Promise<Response>;

  function del (
    path: string,
    options?: laraFetchOptions,
    override?: LaraConfig
  ): Promise<Response>;

  function configure(
    options?: LaraConfig
  )

  function getCsrfToken(
    override?: LaraConfig
): Promise<void>;
}