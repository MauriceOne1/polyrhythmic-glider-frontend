# AGENTS.md

## Project overview

This repository contains the frontend for Polyrhythmic Glider.
Framework: Angular
Language: TypeScript
Package manager: npm

## Goals

- Keep the codebase simple, maintainable, and production-ready
- Prefer modern Angular patterns
- Avoid unnecessary abstractions
- Preserve current app behavior unless the task explicitly asks for changes

## Angular conventions

- Prefer standalone components
- Use signals for local state when appropriate
- Use `input()` and `output()` instead of legacy decorators when possible
- Prefer reactive forms over template-driven forms
- Use Angular control flow (`@if`, `@for`, `@switch`) instead of legacy structural directives when possible
- Keep templates simple and avoid business logic in HTML
- Use `ChangeDetectionStrategy.OnPush` for components unless there is a clear reason not to
- Prefer `inject()` over constructor injection when it improves readability
- Avoid `any`; prefer precise typing or `unknown`

## Styling conventions

- Reuse existing design patterns already present in the app
- Do not introduce new UI libraries unless explicitly requested
- Keep CSS scoped and minimal
- Preserve responsiveness

## Repository workflow

- Before editing, inspect existing patterns in nearby files and follow them
- Make the smallest reasonable change for the requested task
- Do not rewrite unrelated code
- Do not rename files, folders, or public APIs unless required

## Commands

- Install dependencies: `npm install`
- Start dev server: `npm start`
- Build: `npm run build`
- Run tests: `npm test`
- Run lint: `npm run lint`
- Do not run Prettier manually. Formatting is handled by a git hook.

## Before finishing

Always verify:

- the project builds successfully if the task touches Angular code
- there are no obvious TypeScript errors
- imports are clean
- no dead code or debug logs remain
- do not spend time running Prettier or formatting checks manually, because a hook already handles formatting

## Output expectations

When making changes:

- explain briefly what changed
- list touched files
- mention any follow-up needed
- always suggest a commit message that passes commitlint, using Conventional Commits

## Language

- All responses to users must be in Italian
- Code, comments, and technical terms must remain in English
- Explanations should be clear and simple, targeted to developers
