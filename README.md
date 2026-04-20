# Polyrhythmic Glider Frontend

[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-7-purple?logo=reactivex)](https://rxjs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://www.netlify.com/)

Frontend Angular di Polyrhythmic Glider.

Live: <https://polyglider.com>

---

## Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/b66e0339-1654-4d8b-a3e2-01381b46332d/deploy-status)](https://app.netlify.com/projects/polyglider/deploys)

---

## Dev

```bash
npm install
npm start
```

Open: <http://localhost:4200>

---

## Build

```bash
npm run build
```

Output:

```text
dist/polyrhythmic-glider-frontend/browser
```

## Build on Podman (Docker)

```bash
podman build -t polyrhytmic-glider .
```

```bash
podman run -p 4200:4200 polyrhytmic-glider
```
