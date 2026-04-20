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

## Conventions

### Commit messages

Usiamo **Conventional Commits** per mantenere una history leggibile e automatizzare versioning e release.

Formato base:

```text
type(scope): message
```

Esempi:

```text
feat(radio): add audio player
fix(player): resolve playback issue on mobile
chore(deps): update dependencies
```

Tipi principali:

- `feat` → nuova feature
- `fix` → bugfix
- `chore` → roba interna (deps, config, tooling)
- `refactor` → refactor senza cambiare comportamento
- `docs` → documentazione
- `style` → formattazione (no logica)
- `test` → test

Standard ufficiale:
<https://www.conventionalcommits.org/>

Convenzione Angular (quella utilizzata nel progetto):
<https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit>

---

### Formatting

Il progetto usa **Prettier** come formatter di default.

- viene eseguito automaticamente tramite Husky pre-commit
- se il codice non è formattato, il commit viene bloccato

Per formattare manualmente:

```bash
npm run format
```

oppure:

```bash
npx prettier --write .
```

---

### Versioning

Seguiamo **Semantic Versioning (semver)**:

```text
MAJOR.MINOR.PATCH
```

- `PATCH` → bugfix
- `MINOR` → nuove feature
- `MAJOR` → breaking changes

Standard:
<https://semver.org/>
