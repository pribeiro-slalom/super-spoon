# API Contracts & Data Model

## Overview
This document defines the API contracts and the data model for the TODO app ("items"). It includes endpoint definitions, request/response shapes, validation rules, pagination, authentication, and example payloads.

## Authentication
- Use Bearer tokens in the `Authorization` header for protected endpoints:
  - Authorization: Bearer <token>
- Protected endpoints: POST /api/items, PUT /api/items/:id, DELETE /api/items/:id

## Data model — Todo Item
Fields:
- `id` (string, uuid) — Unique identifier for the item
- `title` (string, required, max 255) — Short, human-readable title
- `description` (string, optional) — Longer text
- `completed` (boolean, default: false)
- `dueDate` (string, ISO-8601 date-time, optional)
- `tags` (array[string], optional)
- `ownerId` (string, uuid) — User id who owns the item
- `createdAt` (string, ISO-8601 date-time)
- `updatedAt` (string, ISO-8601 date-time)

JSON Schema (example):

```json
{
  "$id": "https://example.com/schemas/todo.json",
  "type": "object",
  "required": ["title"],
  "properties": {
    "id": {"type": "string", "format": "uuid"},
    "title": {"type": "string", "maxLength": 255},
    "description": {"type": "string"},
    "completed": {"type": "boolean", "default": false},
    "dueDate": {"type": "string", "format": "date-time"},
    "tags": {"type": "array", "items": {"type": "string"}},
    "ownerId": {"type": "string", "format": "uuid"},
    "createdAt": {"type": "string", "format": "date-time"},
    "updatedAt": {"type": "string", "format": "date-time"}
  }
}
```

---

## Endpoints

### GET /api/items
List items (paginated, filterable, searchable).

Query parameters:
- `page` (integer, default: 1)
- `per_page` (integer, default: 20, max: 100)
- `search` (string) — search title/description
- `completed` (boolean) — filter by completion state
- `tags` (string) — comma-separated tags, OR semantics (items having any tag)
- `sort` (string) — e.g., `createdAt`, `-title` (prefix `-` for desc)

Response 200:

```json
{
  "data": [{ /* item */ }],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 123,
    "total_pages": 7
  }
}
```

Errors:
- 400 Bad Request for invalid params

---

### GET /api/items/:id
Get a single item by id.

Response 200:
```json
{ "data": { /* item */ } }
```

Errors:
- 404 Not Found if item does not exist

---

### POST /api/items
Create an item (authenticated)

Headers:
- Authorization: Bearer <token>

Request body (application/json):
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-01-02T12:00:00Z",
  "tags": ["shopping","errands"]
}
```

Response 201 Created
- Body: `{ "data": { /* created item */ } }`
- Header: `Location: /api/items/{id}`

Errors:
- 400 validation error with structured details
- 401 Unauthorized

---

### PUT /api/items/:id
Update an existing item (authenticated, owner only)

Headers:
- Authorization: Bearer <token>

Request body (partial updates allowed):
```json
{ "title": "Buy groceries and snacks", "completed": true }
```

Response 200:
- Body: `{ "data": { /* updated item */ } }`

Errors:
- 400 validation error
- 401 Unauthorized
- 403 Forbidden (not owner)
- 404 Not Found

---

### DELETE /api/items/:id
Delete an item (authenticated, owner only)

Headers:
- Authorization: Bearer <token>

Response 204 No Content

Errors:
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

---

## Error format
Standardized error shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [{"field": "title", "message": "Title is required"}]
  }
}
```

HTTP codes mapping:
- 400 — Validation / Bad Request
- 401 — Unauthorized
- 403 — Forbidden (authorization failure)
- 404 — Not Found
- 500 — Internal Server Error

---

## Examples (curl)
List items:

```bash
curl "http://localhost:3000/api/items?page=1&per_page=20&search=groceries"
```

Create item:

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'
```

---

## Notes & Recommendations
- Use JSON Schema or OpenAPI to keep the contract machine-readable and enable automated validation and client generation.
- Validate request payloads and query params at the API boundary and return consistent error shapes.
- Consider adding ETag/If-None-Match for caching where beneficial.
- Support limit/after cursor pagination if scaling beyond simple needs (cursor-based more efficient for large datasets).

---

## Revision History
- 2025-12-26 — Initial draft added by GitHub Copilot
