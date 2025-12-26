# Testing Guidelines — Super Spoon

## Purpose
Provide clear testing principles, strategies, and practical guidance to ensure the Super Spoon app is reliable, maintainable, and easy to validate.

## Testing Principles ✅
- **Test the behavior, not the implementation.** Prefer observable outputs and user-facing behaviour in tests.
- **Fast & deterministic tests first.** Favor unit and small integration tests that run quickly and consistently.
- **Test pyramid:** More unit tests, fewer integration tests, and just a handful of end-to-end (E2E) tests for critical flows.
- **Make tests readable and maintainable.** Use clear names, small helpers, and avoid over-setup.
- **Automate tests in CI.** All merges to `main` must run the full test suite.

## Test Types & Recommendations 🔧
- **Unit tests** — Isolate a single function/component. Use Jest for backend and frontend unit tests, and React Testing Library for React components.
  - Keep them fast (<50ms each ideally).
- **Integration tests** — Test interactions between modules (e.g., API routes with DB layer using an in-memory DB or test DB).
  - Use realistic test data, but keep setups minimal.
- **End-to-end (E2E) tests** — Test critical user journeys (create item, edit, delete, auth flows) using Cypress or Playwright.
  - Keep E2E suites small and stable; run daily or in nightly pipelines if they are slower.
- **Accessibility tests** — Run automated checks (axe) and include at least one a11y E2E smoke test.
- **Performance tests** — Light-weight performance checks for critical endpoints or pages as part of a periodic pipeline.

## Test Data & Isolation 🧪
- Use fixtures and factories to create test data; avoid hard-coded values across tests.
- Reset test DB state between tests (transactions, truncation, or in-memory instances).
- Avoid coupling tests to external services; use mocks or test doubles for network calls where needed.

## CI & Coverage 📈
- Run tests on PRs and on the `main` branch.
- Set sensible coverage thresholds (e.g., 70% global, higher for new/critical modules) but avoid blocking on 100% unless justified.
- Include linting and type checks (TypeScript) as part of the pipeline.

## Flaky Tests & Reliability ⚠️
- Mark timing-sensitive tests as flaky and investigate root causes promptly.
- Prefer to fix flaky tests by reducing reliance on timers, network timing, or external services; use retries sparingly.
- Keep a short list of quarantined tests with an owner assigned until fixed.

## Local Developer Experience ✨
- Run a fast suite locally (`npm test` for unit/integration); provide scripts for E2E (`npm run e2e`) and full test runs (`npm run test:ci`).
- Use watch mode when iterating on tests (`jest --watch`).
- Provide clear error messages and test debug instructions in the repo README.

## Test Structure & Conventions 📁
- Place tests next to the code (`Component.test.js`) or in `__tests__/` depending on module type.
- Use descriptive test names: `should ... when ...`.
- Keep tests small and focused (one assertion per behavior when practical).

## Security & Privacy in Tests 🔒
- Don’t commit real secrets or PII to test fixtures or recordings. Use placeholders and environment-based secret injection.
- Mask or scrub logs that could contain sensitive data in CI artifacts.

## Monitoring & Reporting 📊
- Fail fast: surface failing tests in PRs immediately.
- Use artifacts (screenshots, videos, logs) for E2E failures to speed debugging.
- Track long-term trends (test runtime, flakiness) and allocate time to reduce technical debt.

## Useful Tools & Libraries
- Unit & Integration: Jest, @testing-library/react, supertest (for API tests)
- E2E: Cypress or Playwright
- Accessibility: axe-core / cypress-axe
- Mocking: msw (Mock Service Worker) for frontend, sinon/jest mocks for backend

## Example NPM scripts (recommended)
- "test": "jest"
- "test:watch": "jest --watch"
- "test:ci": "jest --runInBand --coverage"
- "e2e": "cypress open" or "playwright test"

## Revision History
- 2025-12-26 — Initial draft added by GitHub Copilot
