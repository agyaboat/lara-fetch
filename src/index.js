// --------------------
// laraFetch function
// --------------------
import { laraCsrf } from './csrf.js';

export async function laraFetch(path, options = {}, host, csrfPath = '/sanctum/csrf-cookie', debug = false) {
  // Debug log before fallback
  if (debug && !host) console.warn('laraFetch => no host provided, using http://localhost:8000');

  // Fallbacks
  host = host || 'http://localhost:8000';
  csrfPath = csrfPath || '/sanctum/csrf-cookie';

  const sanitizedPath = path.replace(/^\/+/, '');
  const fullUrl = host + '/' + sanitizedPath;

  const method = (options.method || 'GET').toUpperCase();
  const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  // Only fetch CSRF for body methods
  if (isBodyMethod) await laraCsrf(csrfPath, host, debug);

  // Get CSRF token from cookie
  const xsrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1] || '';

  // Merge headers
  const headers = Object.assign(
    { 'Accept': 'application/json' },
    isBodyMethod && xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {},
    options.headers || {}
  );

  try {
    const res = await fetch(fullUrl, Object.assign({}, options, { credentials: 'include', headers }));

    if (debug) console.log(`laraFetch => ${method} ${fullUrl} => status: ${res.status}`);

    return res;
  } catch (err) {
    if (debug) console.error(`laraFetch => fetch error for ${fullUrl}:`, err);
    throw err;
  }
}
