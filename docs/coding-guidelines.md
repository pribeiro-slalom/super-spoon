# Coding Guidelines — Super Spoon

## Purpose
This document provides a narrative summary of the project's coding style, quality principles, and practical guidance to keep the codebase consistent, maintainable, and safe over time.

## Core Principles
- **Clarity over cleverness:** Prefer straightforward, readable implementations. Future maintainers should understand intent quickly.
- **Small, focused units:** Functions, modules and components should do one thing well. Favor composition over monolithic code.
- **Consistency:** Use shared formatting, naming, and architectural conventions across the repository to reduce cognitive load.
- **Automate quality:** Enforce linters, formatters, tests, and CI checks so that tooling supports consistent quality.
- **Document decisions:** Record significant architecture or API decisions (ADRs) so rationale is available later.

## Style & Formatting
- Use a consistent formatter (Prettier or equivalent) to eliminate style debates. Formatting should be automatic (pre-commit or editor integration).
- Use ESLint with recommended rules and project-specific overrides to catch common issues early.
- Follow semantic, descriptive naming for variables, functions, and components (e.g., `fetchRecipes`, `UserCard`).
- Prefer `const` and `let` appropriately, avoid `var`.
- Keep line lengths reasonable (~100 chars) to improve readability in diffs and editors.

## Language & Patterns (JavaScript / Node / React)
- Prefer modern language features (ES6+) and use `async/await` for asynchronous code; avoid mixing with callbacks where possible.
- Use functional, declarative patterns in React when it improves clarity (hooks, small components).
- Keep components small and presentational concerns separate from business logic; extract logic into hooks or utility modules when it is shared or complex.
- Avoid deep prop chains—use context or state management sparingly and intentionally.

## Testing & Quality Gates
- Write tests for important logic and user-visible behaviors. Prefer testing behavior over implementation details.
- Use Jest for unit and integration tests, and React Testing Library for UI component tests.
- Include at least one E2E test for critical flows (add, edit, delete) using Cypress or Playwright.
- Track test coverage and aim for meaningful coverage thresholds; tests must be part of CI and blocked on failure.

## Commit Messages & Pull Requests
- Use Conventional Commits or a clear, structured commit format: `type(scope): short description` (e.g., `feat(api): add items endpoint`).
- Keep PRs small and focused; each PR should address a single logical change.
- Include tests and update documentation when behavior or interfaces change.
- Ensure PRs pass CI (lint, tests) and request at least one reviewer; address review comments promptly.

## Pre-commit & CI
- Use pre-commit hooks (e.g., husky + lint-staged) to run linters, formatters, and basic tests before committing.
- CI should run linting, type checks (if applicable), unit tests, and E2E where practical.

## Dependency Management & Security
- Keep dependencies up to date and use automated tooling (Dependabot or similar) to propose upgrades.
- Run `npm audit` in CI or on a schedule and address high/critical security issues promptly.
- Prefer well-maintained libraries and avoid adding dependencies for small utilities the project can implement safely.

## Error Handling & Logging
- Fail noisily and early: validate inputs and surface meaningful errors rather than swallowing exceptions silently.
- Use structured logging for server-side logs and avoid leaking sensitive data in logs.

## Documentation & Onboarding
- Keep README and `docs/` content up to date for onboarding, architecture overviews, and developer workflows.
- Document non-obvious trade-offs and the rationale for architectural decisions in ADRs.

## Accessibility & Performance
- Make accessibility considerations part of development (semantic HTML, ARIA attributes, keyboard navigation).
- Measure and address performance-critical paths; prefer simple optimizations first.

## Review & Continuous Improvement
- Treat code review as a collaborative learning opportunity: critique code, not the author.
- Revisit and iterate on guidelines when the team learns better patterns or new tools become relevant.

## Revision History
- 2025-12-26 — Initial draft added by GitHub Copilot
