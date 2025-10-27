export interface LaraConfig {
  baseURL?: string;
  csrfPath?: string;
  credentials?: RequestCredentials;
  debug?: boolean;
}

export declare const config: Required<LaraConfig>;

export declare function laraConfigure(options?: LaraConfig): void;

export declare function laraCsrf(
  override?: LaraConfig
): Promise<void>;

export declare function laraFetch(
  path: string,
  options?: RequestInit,
  override?: LaraConfig
): Promise<Response>;
