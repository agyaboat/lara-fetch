// --------------------
// laraCsrf function
// --------------------
export async function laraCsrf(csrfPath, host, debug = false) {
  // Debug log before fallback
  if (debug && !host) console.warn('laraCsrf => no host provided, using http://localhost:8000');
  if (debug && !csrfPath) console.warn('laraCsrf => no csrfPath provided, using /sanctum/csrf-cookie');

  // Fallbacks
  host = host || 'http://localhost:8000';
  csrfPath = csrfPath || '/sanctum/csrf-cookie';

  const csrfCookieName = 'XSRF-TOKEN';
  const hasCookie = document.cookie.split('; ').some(row => row.startsWith(csrfCookieName + '='));
  if (hasCookie) {
    if (debug) console.log('laraCsrf => CSRF cookie already exists, skipping fetch');
    return;
  }

  if (debug) console.log(`laraCsrf => fetching CSRF cookie from ${host + csrfPath}`);

  try {
    const res = await fetch(host + csrfPath, {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch CSRF token');

    if (debug) console.log('laraCsrf => CSRF cookie fetched successfully');
  } catch (err) {
    if (debug) console.error('laraCsrf => error fetching CSRF token:', err);
    throw err;
  }
}