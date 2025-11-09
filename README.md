# Simple CRUD API with Load Balancer

A simple Node.js CRUD API with in-memory database and load balancing capabilities.

## Features

- ✅ Full CRUD operations for users
- ✅ In-memory database with file persistence
- ✅ Load balancing with Node.js Cluster API
- ✅ TypeScript support
- ✅ Error handling and validation
- ✅ Multiple environment modes

## Technical Requirements

- Node.js 24.14.0 or higher
- TypeScript
- No external frameworks (only allowed dependencies)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd simple-crud-api
   ```
2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

**_Available Scripts_**

1. **Development**

```bash
npm run start:dev
```

Starts the development server with hot-reload using ts-node-dev

2. **Production**

```bash
npm run start:prod
```

Builds the project with Webpack and runs the production bundle

3. **Load Balancer Mode**

```bash
npm run start:multi
```

Starts multiple worker instances with load balancer using Node.js Cluster API

4. **Build**

```bash
npm npm run build
```

Creates production build using Webpack

**_API Endpoints_**

Method Endpoint Description Status Codes
GET /api/users Get all users 200
GET /api/users/{id} Get user by ID 200, 400, 404
POST /api/users Create new user 201, 400
PUT /api/users/{id} Update user 200, 400, 404
DELETE /api/users/{id} Delete user 204, 400, 404

**_User Object Structure_**

```json
{
  "id": "uuid-string",
  "username": "string",
  "age": "number",
  "hobbies": "string[]"
}
```

**_Usage Examples_**

**Create a User**

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Doe",
    "age": 30,
    "hobbies": ["reading", "swimming"]
  }'
```

**Get All Users**

```bash
curl http://localhost:4000/api/users
```

**Get User by ID**

```bash
curl http://localhost:4000/api/users/{user-id}
```

**Update User**

```bash
curl -X PUT http://localhost:4000/api/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Updated",
    "age": 31,
    "hobbies": ["reading", "swimming", "coding"]
  }'
```

**Delete User**

```bash
curl -X DELETE http://localhost:4000/api/users/{user-id}
```

**Error Handling**

**400** - Invalid request (bad UUID, missing fields, invalid JSON)

**404** - Resource not found

**500** - Internal server error
