# Notes on Setting Up the Node.js TypeScript API Server

## Project Initialization
- Created a new directory `video-notes-api` and initialized a Node.js project using `npm init -y`.
- Installed necessary dependencies:
  - `express` (v4.21.2) for the web server
  - `typescript` for TypeScript support
  - `ts-node` for running TypeScript directly
  - `@types/node`, `@types/express`, and `@types/cors` for TypeScript type definitions
  - `cors` for handling cross-origin requests

## TypeScript Configuration
- Created a `tsconfig.json` file with the following settings:
  - Target: ES6
  - Module: CommonJS
  - Output directory: `./dist`
  - Root directory: `./src`
  - Strict mode enabled
  - ES module interop enabled

## Project Structure
```
React-Learning/
├── video-notes/          # Frontend React application
├── video-notes-api/      # Backend API server
│   ├── node_modules/     # Project-specific dependencies
│   ├── src/             # Source code
│   │   ├── index.ts     # Main application file
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── types/       # TypeScript type definitions
│   ├── data/            # JSON data storage
│   ├── package.json     # Project configuration
│   └── package-lock.json # Dependency lock file
└── .git/                # Git repository
```

## Dependencies
### Production Dependencies
- `express` (v4.21.2) - Web framework for Node.js
- `typescript` (v5.3.3) - TypeScript language support
- `ts-node` (v10.9.2) - TypeScript execution engine
- `cors` (v2.8.5) - Cross-Origin Resource Sharing middleware
- `@types/express` (v4.17.22) - TypeScript definitions for Express
- `@types/node` (v20.11.24) - TypeScript definitions for Node.js
- `@types/cors` (v2.8.17) - TypeScript definitions for CORS

### Development Dependencies
- `jest` (v29.7.0) - Testing framework
- `@types/jest` (v29.5.12) - TypeScript definitions for Jest
- `ts-jest` (v29.1.2) - TypeScript preprocessor for Jest
- `supertest` (v6.3.4) - HTTP assertion testing
- `@types/supertest` (v6.0.2) - TypeScript definitions for Supertest

### Important Notes
- Each project (video-notes and video-notes-api) maintains its own dependencies
- Dependencies are scoped to their respective projects
- No shared node_modules between projects
- Follows Node.js best practices for project organization
- Prevents dependency conflicts between projects
- Makes project management and maintenance easier

## API Endpoints
- Implemented the following endpoints:
  - `GET /api/notes` — Get all notes
  - `GET /api/notes/:id` — Get a specific note
  - `POST /api/notes` — Create a new note (send JSON with `title` and `content`)
  - `PUT /api/notes/:id` — Update a note (send JSON with `title` and/or `content`)
  - `DELETE /api/notes/:id` — Delete a note
  - `GET /health` — Health check endpoint

## JSON File Storage
- Used a JSON file (`data/notes.json`) for storing notes, with functions to read and write to this file.

## Running the Server
- Added scripts in `package.json`:
  - `npm run dev` — Start the server in development mode using `ts-node`
  - `npm run build` — Compile TypeScript to JavaScript
  - `npm start` — Run the compiled JavaScript

## Troubleshooting
- Initially encountered TypeScript errors due to incorrect typing in route handlers. Fixed by removing explicit generic types from `Request` in `noteRoutes.ts`.
- Ensured compatibility between Express and its types by aligning them to Express 4.

## Testing the API
There are several ways to test the API:

### 1. Using cURL
```bash
# Get all notes
curl http://localhost:3001/api/notes

# Get a specific note
curl http://localhost:3001/api/notes/123

# Create a new note
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"This is a test note"}'

# Update a note
curl -X PUT http://localhost:3001/api/notes/123 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Note","content":"This is an updated note"}'

# Delete a note
curl -X DELETE http://localhost:3001/api/notes/123
```

### 2. Using Postman
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new collection for your API
3. Add requests for each endpoint:
   - GET http://localhost:3001/api/notes
   - GET http://localhost:3001/api/notes/:id
   - POST http://localhost:3001/api/notes
   - PUT http://localhost:3001/api/notes/:id
   - DELETE http://localhost:3001/api/notes/:id
4. For POST and PUT requests, set the body to raw JSON and add your note data

### 3. Using Thunder Client (VS Code Extension)
1. Install Thunder Client extension in VS Code
2. Create a new collection
3. Add requests similar to Postman
4. Test endpoints directly from VS Code

### 4. Using Automated Tests
For automated testing, you can use tools like:
- Jest with supertest for unit and integration tests
- Mocha with chai for BDD-style tests
- Postman collections with Newman for automated API testing

Example test setup with Jest and supertest:
```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

Add to package.json:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Create jest.config.js:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

## Jest Testing Setup
- Installed testing dependencies:
  ```bash
  npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
  ```

- Created `jest.config.js` with TypeScript support:
  ```javascript
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
  };
  ```

- Added test scripts to `package.json`:
  ```json
  {
    "scripts": {
      "test": "jest",
      "test:watch": "jest --watch"
    }
  }
  ```

### Running Tests
- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`

### Watch Mode Commands
- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by filename
- `t` - Filter by test name
- `q` - Quit watch mode
- `Enter` - Trigger a test run

### Test Coverage
The test suite covers:
1. Creating notes
   - Successfully creating a note
   - Handling missing required fields
2. Getting notes
   - Getting all notes
   - Getting a specific note
   - Handling non-existent notes
3. Updating notes
   - Successfully updating a note
   - Handling non-existent notes
4. Deleting notes
   - Successfully deleting a note
   - Handling non-existent notes

### Test Structure
Tests are organized using Jest's `describe` and `it` blocks:
```typescript
describe('Note API Endpoints', () => {
  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      // Test implementation
    });
  });
});
```

### Test Cleanup
- Using `afterAll` hook to clean up test data
- Each test suite maintains its own test data
- Tests are independent and can be run in any order

## Next Steps
- Consider adding validation, error handling middleware, or integrating a database for production use.

# API Documentation with Swagger

## Overview
This API uses Swagger/OpenAPI for documentation. The documentation is available at `/api-docs` when the server is running.

## Documentation Structure

### 1. Swagger Configuration (`swagger.ts`)
- Defines the overall API configuration
- Contains reusable schema definitions
- Specifies server information
- Sets up API metadata

Key components:
```typescript
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Video Notes API',
      version: '1.0.0',
      description: 'API for managing video notes with timestamps',
    },
    servers: [...],
    components: {
      schemas: {
        Note: {...},
        CreateNoteDto: {...},
        UpdateNoteDto: {...}
      }
    }
  },
  apis: ['./src/routes/*.ts']
};
```

### 2. Route Documentation (`noteRoutes.ts`)
- Uses JSDoc comments with `@swagger` annotations
- Documents each endpoint's:
  - HTTP method
  - Path
  - Parameters
  - Request body
  - Response schemas
  - Status codes

Example:
```typescript
/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
```

### 3. Server Integration (`index.ts`)
- Sets up Swagger UI
- Configures the documentation endpoint
```typescript
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

## Available Endpoints

1. **GET /api/notes**
   - Get all notes
   - Returns array of Note objects

2. **GET /api/notes/{id}**
   - Get a specific note by ID
   - Returns a single Note object

3. **POST /api/notes**
   - Create a new note
   - Requires: title, content, startTime, endTime
   - Returns the created Note object

4. **PUT /api/notes/{id}**
   - Update an existing note
   - Accepts partial Note data
   - Returns the updated Note object

5. **DELETE /api/notes/{id}**
   - Delete a note
   - Returns 204 on success

## Data Models

### Note
```typescript
{
  id: string;
  title: string;
  content: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
}
```

### CreateNoteDto
```typescript
{
  title: string;
  content: string;
  startTime: number;
  endTime: number;
}
```

### UpdateNoteDto
```typescript
{
  title?: string;
  content?: string;
  startTime?: number;
  endTime?: number;
}
```

## Testing the API
1. Start the server: `npm run dev`
2. Visit `http://localhost:3001/api-docs`
3. Use the Swagger UI to:
   - View all available endpoints
   - See request/response schemas
   - Test endpoints directly from the browser
   - View example requests and responses 