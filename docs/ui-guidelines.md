# UI Guidelines — TODO App

## Purpose
Provide concise, consistent design and implementation guidelines for the TODO app UI so that interfaces are usable, accessible, and easy to maintain.

## Design principles ✅
- **Simple:** Keep interactions minimal and predictable.
- **Discoverable:** Primary actions should be prominent and easy to find.
- **Accessible:** Prioritize keyboard navigation, screen-reader support, and color contrast.
- **Responsive:** Work across desktop and mobile with linear, single-column stacks on small screens.

## Tokens & Styles 🔧
- Color tokens (examples): `--color-bg`, `--color-surface`, `--color-primary`, `--color-accent`, `--color-success`, `--color-warning`, `--color-error`, `--color-text`, `--color-muted`.
- Typography: use system fonts for speed and consistency. Sizes: Base `16px`, H1 `24px`, H2 `20px`, body `16px`, small `14px`.
- Spacing: use an 8px spacing scale: 8 / 16 / 24 / 32 for margins/padding.
- Iconography: simple SVG icons, consistent stroke weight, 16–20px in lists, 24–28px for primary actions.

## Layout & Breakpoints 📱
- Keep content centered inside a max-width container (max 960–1120px).
- Breakpoints: mobile < 640px, tablet 640–1024px, desktop > 1024px.
- Use a vertical flow: header → input / controls → list → footer.

## Core Components 🔩
- Header
  - App title, optional account/menu button, clear branding.
- Add TODO input
  - Single-line input with placeholder `Add a task...`, primary action button labeled `Add` or `Enter` to submit.
  - Support Enter key to submit and Esc to clear/cancel.
- Todo List
  - Use semantic list markup (`<ul>/<li>`) and an accessible list role.
  - Each item shows: checkbox, title, optional due date / tags, actions (edit, delete).
  - Support inline editing and hover/active states.
- Todo Item
  - Checkbox toggles complete state (optimistic update), completed items use muted text + strikethrough.
  - Long titles wrap; truncation allowed with full title on hover/focus.
- Filters & Search
  - Filter controls for All / Active / Completed; include a search box that filters in real-time.
- Bulk Actions
  - Select multiple items to delete or mark complete; require clear affordance and a confirmation for destructive actions.
- Empty State
  - Provide friendly copy, a clear primary CTA (Add task), and example tasks or shortcuts.
- Notifications & Undo
  - Use non-blocking toasts for actions (e.g., "Task deleted. Undo"), show for 3–5s and provide an Undo action.
- Confirmations / Modals
  - Use modals sparingly for destructive actions; ensure keyboard focus trap and clear primary/secondary actions.

## Interaction Patterns ✨
- Keyboard: Enter to add, Space to toggle checkbox, E to edit selected item (optional), Del to delete (with confirmation), Esc to cancel.
- Drag & Drop: support to reorder tasks on desktop; provide touch-friendly handles on mobile or alternate reorder controls.
- Optimistic updates: reflect changes immediately, rollback on error with a visible message.

## Accessibility ♿️
- Semantic HTML: forms, lists, buttons, headings.
- ARIA: use `aria-checked`, `aria-label` for icon-only buttons, and `role="list"/"listitem"` when needed.
- Focus states: highly visible outlines for keyboard focus; focus visible by default.
- Color contrast: meet WCAG AA (4.5:1 for normal text) for all text and controls.
- Screen reader announcements: announce success/failure messages and important changes (e.g., "3 tasks selected").
- Reduced motion: respect `prefers-reduced-motion` and provide alternatives.

## Content & Tone 💬
- Use concise, action-oriented labels: `Add task`, `Edit`, `Delete`, `Mark complete`.
- Error language: explain the problem and a clear next step (e.g., "Failed to save. Try again.").

## Localization & Formats 🌐
- Use i18n keys for all visible strings; support pluralization and date formats.
- Avoid embedding punctuation or formatting in translatable strings when possible.

## Performance & Data Handling ⚡️
- Keep renders fast: memoize list items, minimize re-renders on state changes.
- For large lists, use virtualization or pagination.
- Use debounce for search input (e.g., 250ms) and avoid blocking UI with long-running operations.

## Testing & QA ✅
- Component tests for core behaviors (add, edit, delete, filter, reorder).
- Accessibility tests (axe, screen-reader smoke tests) and keyboard-only navigation tests.
- Visual regression tests for critical flows and components.

## Implementation tips 🔧
- Prefer isolated, small components (e.g., `TodoItem`, `TodoList`, `AddTodoForm`).
- Keep state local when possible; hoist state only when multiple components need access.
- Expose small, well-documented props for shared components.

## Revision History
- 2025-12-26 — Initial draft added by GitHub Copilot

