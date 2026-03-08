# SphereTest API – cURL Examples

Base URL: `http://localhost:5000`

## Prerequisites

1. Make sure MongoDB is running locally.
2. In the `backend` folder, seed sample data (optional but recommended):
   ```bash
   node seedData.js
   ```
3. Start the API server:
   ```bash
   node src/server.js
   ```

You can then use the following `curl` commands to exercise all endpoints.

---

## Users

### Create User – `POST /api/users`

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "admin@example.com",
    "role": "admin"
  }'
```

### Get All Users – `GET /api/users`

```bash
curl http://localhost:5000/api/users
```

---

## Spheres

> Tip: After running `node seedData.js`, call `GET /api/users` to obtain real user IDs and replace the placeholders below.

### Create Sphere – `POST /api/spheres`

```bash
curl -X POST http://localhost:5000/api/spheres \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Sphere",
    "description": "Demo sphere for testing",
    "createdBy": "<ADMIN_USER_ID>",
    "participants": ["<ADMIN_USER_ID>", "<STUDENT_USER_ID_1>", "<STUDENT_USER_ID_2>"]
  }'
```

### Get All Spheres – `GET /api/spheres`

```bash
curl http://localhost:5000/api/spheres
```

### Get Sphere by ID – `GET /api/spheres/:id`

```bash
curl http://localhost:5000/api/spheres/<SPHERE_ID>
```

### Delete Sphere – `DELETE /api/spheres/:id`

```bash
curl -X DELETE http://localhost:5000/api/spheres/<SPHERE_ID>
```

---

## Questions

> Tip: Use a real `<SPHERE_ID>` from `GET /api/spheres` or from the seed output.

### Create Question – `POST /api/questions`

```bash
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "sphereId": "<SPHERE_ID>",
    "questionText": "What is 2 + 2?",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": "4"
  }'
```

### Get Questions for a Sphere – `GET /api/questions/:sphereId`

```bash
curl http://localhost:5000/api/questions/<SPHERE_ID>
```

