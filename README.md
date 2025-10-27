# 📦 lara-fetch 
![npm](https://img.shields.io/npm/v/lara-fetch?color=crimson&style=flat-square)
![bundle size](https://img.shields.io/badge/bundle-3.83kb-brightgreen?style=flat-square)
![license](https://img.shields.io/npm/l/lara-fetch?style=flat-square)

╔════════════════════════════════════╗
║      lara-fetch 🛡️ Fetch Wrapper    ║
║  Lightweight, CSRF-aware, TypeScript ✅ ║
╚════════════════════════════════════╝
A tiny fetch wrapper that handles **Laravel Sanctum CSRF** like a boss.

---

## ⚡ Quick Features

- ✅ Auto CSRF cookie fetch on write operations (POST / PUT / PATCH / DELETE)
- ✅ Reads `XSRF-TOKEN` cookie + injects matching header automatically
- ✅ Built for Laravel Sanctum SPA authentication
- ✅ Zero-config convenience for **local development**
- ✅ Full configuration control for **production**
- ✅ Per-request overrides (just a **3rd param**)
- ✅ Debug mode for console tracing
- ✅ Lightweight — no Axios bloat

Small library. Main character energy. 😎

---

## 🚀 Install

```bash
npm install lara-fetch
# or
yarn add lara-fetch
# or
pnpm add lara-fetch
```

## 🧃 Basic Usage (Local Dev Quickstart)

> ✅ Assumes:
> - Laravel: `http://localhost:8000`
> - Sanctum CSRF route: `/sanctum/csrf-cookie`
> - Cookie name: `XSRF-TOKEN`

> ⚠️ **Warning:**  
> Only use this **zero-config** setup for **local development**.  
> Production requires proper configuration (next section ✅).

### GET Example

```js
import { laraFetch } from "lara-fetch";

const res = await laraFetch("/api/user");
const data = await res.json();

console.log(data);
```

### POST Example

```js
import { laraFetch } from "lara-fetch";
const res = await laraFetch("/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
const data = await res.json();
console.log(data);
```


## 🌍 Production Setup (Recommended)

Configure once globally:

```js
import { laraConfigure } from "lara-fetch";

laraConfigure({
  baseURL: "https://api.example.com",
  csrfPath: "/sanctum/csrf-cookie",
  credentials: "include",
  debug: false,
  defaultHeaders: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
```

### Config options:

| Option           | Purpose                          | Default                 |
| ---------------- | -------------------------------- | ----------------------- |
| `baseURL`        | Your Laravel API root            | `http://localhost:8000` |
| `csrfPath`       | Where Sanctum stores CSRF cookie | `/sanctum/csrf-cookie`  |
| `xsrfCookieName` | Cookie name holding CSRF token   | `XSRF-TOKEN`            |
| `defaultHeaders` | Global headers for requests      | JSON headers            |
| `credentials`    | Include cookies for Sanctum auth | `include`               |
| `debug`          | Enables console logs             | `false`                 |



## 🎛️ Per-request Override

Switch host, headers, credentials just for one call:

```js
await laraFetch(
  "/special",
  { method: "POST" },
  {
    baseURL: "https://staging.example.com",
    defaultHeaders: {
      "X-Feature-Flag": "Beta",
    },
    debug: true,
  }
);
```
> 💡 Only pass a third object parameter to `laraFetch`, including as many of the config options you want to override for this specific request.


## 🐛 Debugging
Enable debug mode globally or per-request to see console logs:

```js
laraConfigure({ debug: true }); // Global
// or
await laraFetch("/endpoint", {}, { debug: true }); // Per-request
```

## 🔐 Manual CSRF (Optional)

Pre-fetch the CSRF cookie if needed:

```js
import { laraCsrf } from "lara-fetch";

await laraCsrf();
// Now safe to make write requests
```
> 💡 You can override baseURL, csrfPath, or any other config by passing an object to laraCsrf:
```js
await laraCsrf({
  baseURL: "https://staging.example.com",
  csrfPath: "/sanctum/csrf-cookie",
});
```

## 🧠 TypeScript Support
Type definitions are included. Example:

```ts
import type { LaraConfig } from "lara-fetch";

laraConfigure({
  baseURL: "https://prod.example.com",
} satisfies LaraConfig);
```
> Autocomplete + type safety ✅
> Dev confidence: 💯


## License
MIT License © [Agyemang Bright Boateng (Agya Boat)](https://github.com/agyaboat)
Go Build stuff.
---

## Contribute
Contributions welcome! Feel free to open issues or PRs on [GitHub](https://github.com/agyaboat/lara-fetch).
