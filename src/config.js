// Global shared configuration state
export const config = {
  baseURL: 'http://localhost:8000',
  csrfPath: '/sanctum/csrf-cookie',
  credentials: 'include',
  debug: false
};

// Update config safely
export function laraConfigure(options = {}) {
  Object.assign(config, options);
  if (config.debug) console.log('laraConfigure =>', config);
}
