import { config } from './config.js';

export async function laraCsrf(override = {}) {
  const { baseURL, csrfPath, debug } = { ...config, ...override };

  if (debug && !override.baseURL) {
    console.warn(`laraCsrf => no host override, using ${baseURL}`);
  }

  const csrfCookieName = config.xsrfCookieName || 'XSRF-TOKEN';
  const hasCookie = document.cookie
    .split('; ')
    .some(row => row.startsWith(csrfCookieName + '='));

  if (hasCookie) {
    if (debug) console.log('laraCsrf => CSRF cookie already exists ✅');
    return;
  }

  const url = baseURL + csrfPath;
  if (debug) console.log(`laraCsrf => fetching CSRF cookie from ${url}`);

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include'
  });

  if (!res.ok) {
    const err = new Error(`Failed CSRF fetch: ${res.status}`);
    if (debug) console.error('laraCsrf =>', err);
    throw err;
  }

  if (debug) console.log('laraCsrf => CSRF cookie fetched ✅');
}
