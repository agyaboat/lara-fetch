# 📦 lara-fetch 
![npm](https://img.shields.io/npm/v/lara-fetch?color=1e90ff&style=flat-square)
![bundle size](https://img.shields.io/badge/bundle-5kb-brightgreen?style=flat-square)
![license](https://img.shields.io/npm/l/lara-fetch?style=flat-square)


A tiny fetch wrapper that handles **Laravel Sanctum CSRF** like a boss.
---

<br>

## ⚡ Quick Features

- ✅ Auto CSRF cookie fetch on write operations (POST / PUT / PATCH / DELETE)
- ✅ Reads `XSRF-TOKEN` cookie + injects matching header automatically
- ✅ Built for Laravel Sanctum SPA authentication
- ✅ Zero-config convenience for **local development**
- ✅ Full configuration control for **production**
- ✅ Per-request overrides (just a **3rd param**)
- ✅ **GET / POST / PUT / PATCH / DELETE** helper methods
- ✅ Debug mode for console tracing
- ✅ Lightweight
- ✅ Browser support via jsdeliver

Small library. Main character energy. 😎
---

<br>

## 🚀 Install

```bash
npm install lara-fetch
# or
yarn add lara-fetch
# or
pnpm add lara-fetch
```

<br>

## 🧃 Basic Usage (Local Dev Quickstart)

> ✅ Assumes:
> - Laravel: `http://localhost:8000`
> - Sanctum CSRF route: `/sanctum/csrf-cookie`
> - Cookie name: `XSRF-TOKEN`

> ⚠️ **Warning:**  
> Only use this **zero-config** setup for **local development**.  
> Production requires proper configuration (next section ✅).
<br>

### GET Example

```js
import { laraFetch } from "lara-fetch";

const res = await laraFetch("/api/user");
const data = await res.json();

console.log(data);
```
<br>

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

<br>

## 🌍 Production Setup (Recommended)

Configure once globally:

```js
import { laraFetch } from "lara-fetch";

laraFetch.configure({
  baseURL: "https://api.example.com",
  csrfPath: "/sanctum/csrf-cookie",
  credentials: "include",
  debug: false,
  defaultHeaders: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


//=============  OR =================== 
import { laraConfigure } from "lara-fetch";
laraConfigure({ ... });

```
<br>

### Config options:

| Option           | Purpose                          | Default                 |
| ---------------- | -------------------------------- | ----------------------- |
| `baseURL`        | Your Laravel API root            | `http://localhost:8000` |
| `csrfPath`       | Where Sanctum stores CSRF cookie | `/sanctum/csrf-cookie`  |
| `xsrfCookieName` | Cookie name holding CSRF token   | `XSRF-TOKEN`            |
| `defaultHeaders` | Global headers for requests      | JSON headers            |
| `credentials`    | Include cookies for Sanctum auth | `include`               |
| `debug`          | Enables console logs             | `false`                 |


<br>

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

<br>

## HELPER Methods
Use dedicated methods for common HTTP verbs:
<br>
Available: `get`, `post`, `put`, `patch`, `del`
<br>

📜 **NB**: 
> No need to set `method` in options, these helpers do it for you.

```js
import { laraFetch } from "lara-fetch";
// GET
const res1 = await laraFetch.get("/api/user"); 

// POST
const res2 = await laraFetch.post("/login", {
  body: JSON.stringify({ email, password }),
});

// PUT
const res3 = await laraFetch.put("/api/user/1", {
  body: JSON.stringify({ name: "New Name" }),
});

// PATCH
const res4 = await laraFetch.patch("/api/user/1", {
  body: JSON.stringify({ name: "Updated Name" }),
});

// DELETE
const res5 = await laraFetch.del("/api/user/1");

``` 

### ✅ What helper methods do under the hood

| `laraFetch` Method | HTTP Verb Sent     | Body Auto-Modified?                              | Behavior / Why                                                      |
| ------------------ | ------------------ | ------------------------------------------------ | ------------------------------------------------------------------- |
| `get()`            | GET                | ❌                                                | Normal GET, nothing special                                         |
| `post()`           | POST               | ✅ (if form) `_method=POST`                       | Safe for Laravel form submits (even tho POST rarely needs spoofing) |
| `put()`            | **PUT or POST**    | ✅ `_method=PUT` **if form**, else real PUT       | Laravel treats PUT over form as POST + spoof                        |
| `patch()`          | **PATCH or POST**  | ✅ `_method=PATCH` **if form**, else real PATCH   | Same reason as PUT                                                  |
| `del()`            | **DELETE or POST** | ✅ `_method=DELETE` **if form**, else real DELETE | Delete forms always need spoof in Laravel                           |
   
<br>

### 🤖 Built-in auto detection

| Body Format               | What laraFetch does                               |
| ------------------------- | ------------------------------------------------- |
| JSON (`application/json`) | Use real HTTP verbs (PUT/PATCH/DELETE)            |
| `FormData`                | Convert request to POST + inject `_method=<verb>` |
| `x-www-form-urlencoded`   | Same as FormData override ✅                      |
| No body                   | Normal request Behavior                           |

<br>

### ✅ TL;DR: Defaults in one line
> If it's JSON → send real method.
> If its a form → spoof method with POST.

<br>

## 🐛 Debugging
Enable debug mode globally or per-request to see console logs:

```js
laraConfigure({ debug: true }); // Global
// or
await laraFetch("/endpoint", {}, { debug: true }); // Per-request
```


<br>

## 🌍 Browser Support via CDN

lara-fetch can be used directly in the browser — no build tools needed!

### CDN Example:

```js
<script src="https://cdn.jsdelivr.net/npm/lara-fetch/dist/index.umd.js"></script>
<script>
  // Configure once
  laraFetch.configure({
    baseURL: 'https://jsonplaceholder.typicode.com',
    debug: true
  });

  // Fetch example
  laraFetch('users/3')
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
</script>

```

✅ Works out of the box in browsers
✅ Same API as Node/Vite builds
✅ Ideal for quick prototyping or Laravel SPA setups
---

<br>

## 🔐 Manual CSRF (Optional)

Pre-fetch the CSRF cookie if needed:

```js
import { laraFetch } from "lara-fetch";
await laraFetch.getCsrfToken();

//================= OR ===================
import { laraCsrf } from "lara-fetch";

await laraCsrf();
// Now safe to make write requests
```

> 💡 You can override baseURL, csrfPath, or any other config by passing an object to laraCsrf:

```js
await laraFetch.getCsrfToken({...override_configs});

//================= OR ===================
await laraCsrf({...override_configs});

```

<br>

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

<br>

## License
MIT License © [Agyemang Bright Boateng (Agya Boat)](https://github.com/agyaboat)
Go Build stuff.
---

<br>

## Contribute
Contributions welcome! Feel free to open issues or PRs on [GitHub](https://github.com/agyaboat/lara-fetch).
