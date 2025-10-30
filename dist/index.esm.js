// Global shared configuration state
const config = {
    baseURL: 'http://localhost:8000',
    csrfPath: '/sanctum/csrf-cookie',
    xsrfCookieName: 'XSRF-TOKEN',
    credentials: 'include',
    debug: false,
    defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

// Update config safely
function laraConfigure(options = {}) {
    Object.assign(config, options);
    if (config.debug) console.log('laraConfigure =>', config);
}

async function laraCsrf(override = {}) {
  const { baseURL, csrfPath, debug } = { ...config, ...override };

  if (debug && !override.baseURL) {
    console.warn(`laraCsrf => no host override, using ${baseURL}`);
  }

  const csrfCookieName = config.xsrfCookieName || 'XSRF-TOKEN';
  const hasCookie = document.cookie
    .split('; ')
    .some(row => row.startsWith(csrfCookieName + '='));

  const getFresh = override.fresh || false;

  if (hasCookie && !getFresh) {
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

async function laraFetch(path, options = {}, override = {}) {
    const { baseURL, debug } = { ...config, ...override };

    if (debug && !override.baseURL) {
        console.warn(`laraFetch => no host override, using ${baseURL}`);
    }

    const sanitized = path.replace(/^\/+/, '');
    let url = baseURL + '/' + sanitized;

    const queryOptions = options.query || {};
    const queryString = new URLSearchParams(queryOptions).toString();
    if (queryString) {
        url += url.includes('?')
            ? `&${queryString}`
            : `?${queryString}`;
    }

    const method = (options.method || 'GET').toUpperCase();
    const needsBodyToken = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    // Ensure CSRF when body involved
    if (needsBodyToken) await laraCsrf(override);

    const csrfCookieName = override.xsrfCookieName || config.xsrfCookieName || 'XSRF-TOKEN';
    const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${csrfCookieName}=`))
        ?.split('=')[1] || '';

    const xsrf_string = `X-${csrfCookieName}` ;

    const configDefaultHeaders = { ...(config.defaultHeaders || {}) };
    if (options.body instanceof FormData) {
        delete configDefaultHeaders['Content-Type'];
    }

    const headers = Object.assign(
        configDefaultHeaders || {},
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
        if(res.status == 419){
           laraFetch.getCsrfToken({fresh:true});
        }
	return res;
    } catch (err) {
        if (debug) console.error(`laraFetch => error:`, err);
        throw err;
    }
}

/**
 * Normalize method & body for Laravel compatibility.
 * FormData or urlencoded bodies => force POST + _method
 * JSON => use real HTTP verb
 */
function normalizeMethod(originalMethod, body, headers = {}) {
    const method = originalMethod.toUpperCase();
    const newHeaders = { ...headers };

    if (body instanceof FormData) {
        body.append('_method', method);
        // Remove JSON Content-Type if present
        if (newHeaders['Content-Type'] === 'application/json') delete newHeaders['Content-Type'];
        return { method: 'POST', transformedBody: body, headers: newHeaders };
    }

    if (body && body.constructor.name === 'URLSearchParams') {
        body.append('_method', method);
        newHeaders['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        return { method: 'POST', transformedBody: body, headers: newHeaders };
    }

    if (
        body &&
        typeof body === 'object' &&
        !(body instanceof Blob) &&
        !(body instanceof ArrayBuffer)
    ) {
        if (!newHeaders['Content-Type']) newHeaders['Content-Type'] = 'application/json';
    }

    return { method, transformedBody: body, headers: newHeaders };
}

['get', 'post', 'put', 'patch', 'delete'].forEach((verb) => {
    const met = verb === 'delete' ? 'del' : verb;
    laraFetch[met] = async (path, options = {}, overrides = {}) => {
        const { method: resolvedMethod, transformedBody, headers } = normalizeMethod(
        verb.toUpperCase(),
        options.body,
        options.headers
        );

        // const leave_content_type_header = overrides.leave_content_type_header || false;  

        options.headers = headers;
        options.body = transformedBody;
        options.method = resolvedMethod;

        return laraFetch(
            path,
            options,
            overrides,
        );
    };
});

laraFetch['configure'] = (options = {})=>{
    laraConfigure(options);
};

laraFetch['getCsrfToken'] = (overrides = {})=>{
    laraCsrf(overrides);
};

export { laraFetch as default, laraConfigure, laraCsrf };
