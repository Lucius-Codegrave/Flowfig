# 📚 Flowfig API Documentation

REST API for task management with JWT authentication.

## Base URL

```text
http://localhost:3000
```

## Auth Setup

Include JWT token in Authorization header:

```text
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### Register

`POST /auth/register`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Login

`POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Tasks

> All task endpoints require authentication.

#### Get All Tasks

`GET /tasks`

#### Get Task by ID

`GET /tasks/:id`

#### Create Task

`POST /tasks`

```json
{
  "title": "Task title",
  "description": "Task description"
}
```

#### Update Task

`PUT /tasks/:id`

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### Toggle Task

`PATCH /tasks/:id/toggle`

#### Delete Task

`DELETE /tasks/:id`

---

## Error Format

```json
{
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Example Usage

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'

# Get all tasks
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific task
curl -X GET http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create task
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn API","description":"Master REST APIs"}'

# Update task
curl -X PUT http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description","completed":true}'

# Toggle task completion
curl -X PATCH http://localhost:3000/tasks/TASK_ID/toggle \
  -H "Authorization: Bearer YOUR_TOKEN"

# Delete task
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Health check
curl -X GET http://localhost:3000/
```
