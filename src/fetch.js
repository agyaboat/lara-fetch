import { config } from './config.js';
import { laraCsrf } from './csrf.js';

export async function laraFetch(path, options = {}, override = {}) {
    const { baseURL, csrfPath, debug } = { ...config, ...override };

    if (debug && !override.baseURL) {
        console.warn(`laraFetch => no host override, using ${baseURL}`);
    }

    const sanitized = path.replace(/^\/+/, '');
    const url = baseURL + '/' + sanitized;

    const method = (options.method || 'GET').toUpperCase();
    const needsBodyToken = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    // Ensure CSRF when body involved
    if (needsBodyToken) await laraCsrf(override);

    const csrfCookieName = override.xsrfCookieName || config.xsrfCookieName || 'XSRF-TOKEN';
    const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${csrfCookieName}=`))
        ?.split('=')[1] || '';

    const xsrf_string = csrfCookieName ? `X-${csrfCookieName}` : 'X-XSRF-TOKEN';
    const headers = Object.assign(
        config.defaultHeaders || {},
        needsBodyToken && xsrfToken ? { [xsrf_string]: decodeURIComponent(xsrfToken) } : {},
        options.headers || {},
        override.defaultHeaders || {}
    );

    const credentials = override.credentials ?? options.credentials ?? config.credentials ?? 'include';
    const fetchOptions = Object.assign({}, options, {
        method,
        credentials,
        headers
    });

    try {
        if (debug) console.log(`laraFetch => ${method} ${url}`);
        const res = await fetch(url, fetchOptions);
        if (debug) console.log(`laraFetch => status: ${res.status}`);
        return res;
    } catch (err) {
        if (debug) console.error(`laraFetch => error:`, err);
        throw err;
    }
}
