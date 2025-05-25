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

## TypeScript Configuration Details

### What is tsconfig.json?
`tsconfig.json` is a configuration file that specifies the compiler options required to compile a TypeScript project. It tells the TypeScript compiler:
- How to compile the code
- What files to include/exclude
- What JavaScript version to target
- How strict the type checking should be
- Where to output the compiled files

### Our tsconfig.json Configuration
```json
{
  "compilerOptions": {
    "target": "ES6",        // Specifies ECMAScript target version
    "module": "CommonJS",   // Specifies module code generation
    "outDir": "./dist",     // Output directory for compiled files
    "rootDir": "./src",     // Root directory of source files
    "strict": true,         // Enable all strict type checking options
    "esModuleInterop": true // Enables compatibility with CommonJS modules
  }
}
```

### Why tsconfig.json with Node.js?
1. **Type Safety**: Provides compile-time type checking
2. **Better IDE Support**: Enables better code completion and error detection
3. **Module Resolution**: Handles module imports and exports
4. **Build Process**: Manages the TypeScript to JavaScript compilation
5. **Project Structure**: Defines the project's source and output directories

### Comparison with Vite

#### Why we chose tsconfig.json over Vite:
1. **Simplicity**: Traditional and straightforward setup for Node.js/Express
2. **Maturity**: Well-tested in production environments
3. **Dependencies**: Fewer dependencies to manage
4. **Learning Curve**: Easier to understand for TypeScript/Node.js beginners
5. **Production Readiness**: More battle-tested in production

#### When to use Vite for backend:
1. Full-stack applications with Vite frontend
2. Need for faster development feedback
3. Modern ES modules throughout the application
4. Smaller applications where Vite's development server is valuable

#### When to stick with tsconfig.json:
1. Larger, traditional Node.js applications
2. Maximum compatibility with Node.js tools
3. Simpler, straightforward setup
4. Teams familiar with traditional Node.js setups

### TypeScript with Node.js Best Practices
1. **Project Structure**:
   ```
   project/
   ├── src/           # TypeScript source files
   ├── dist/          # Compiled JavaScript files
   ├── tsconfig.json  # TypeScript configuration
   └── package.json   # Project configuration
   ```

2. **Development Workflow**:
   - Write TypeScript code in `src/`
   - Use `ts-node` for development
   - Compile to JavaScript for production
   - Use type definitions for better IDE support

3. **Common Compiler Options**:
   - `target`: JavaScript version to compile to
   - `module`: Module system to use
   - `strict`: Enable strict type checking
   - `esModuleInterop`: Better module compatibility
   - `outDir`: Output directory for compiled files
   - `rootDir`: Source files directory

4. **Type Definitions**:
   - Install `@types` packages for better type support
   - Example: `@types/node`, `@types/express`
   - Helps catch errors at compile time

5. **Development Tools**:
   - `ts-node`: Run TypeScript directly
   - `tsc`: TypeScript compiler
   - IDE support (VS Code, WebStorm)

### TypeScript Benefits in Our Project
1. **Type Safety**:
   - Catch errors before runtime
   - Better code completion
   - Self-documenting code

2. **Better Development Experience**:
   - IDE support
   - Refactoring tools
   - Code navigation

3. **Maintainability**:
   - Clear interfaces
   - Type checking
   - Better code organization

4. **Documentation**:
   - Types serve as documentation
   - Better understanding of data structures
   - Easier onboarding for new developers

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

## Module Systems in TypeScript/Node.js

### Common Module Systems

1. **CommonJS (CJS)**
   ```typescript
   // Exporting
   module.exports = { function1, function2 };
   // or
   exports.function1 = function1;
   
   // Importing
   const { function1 } = require('./module');
   ```
   - Used in: Traditional Node.js applications
   - File extension: `.js`, `.cjs`
   - Runtime loading
   - Synchronous imports
   - Best for: Server-side applications, legacy Node.js code

2. **ECMAScript Modules (ESM)**
   ```typescript
   // Exporting
   export const function1 = () => {};
   export default class MyClass {};
   
   // Importing
   import { function1 } from './module.js';
   import MyClass from './module.js';
   ```
   - Used in: Modern JavaScript/TypeScript applications
   - File extension: `.mjs`, `.js` (with "type": "module")
   - Static analysis
   - Asynchronous imports
   - Best for: Modern web applications, browser code

3. **TypeScript Modules**
   ```typescript
   // Exporting
   export interface MyInterface {}
   export type MyType = string;
   export class MyClass {}
   
   // Importing
   import { MyInterface, MyType, MyClass } from './module';
   ```
   - Used in: TypeScript projects
   - File extension: `.ts`, `.tsx`
   - Compile-time checking
   - Type information included
   - Best for: TypeScript projects, type-safe applications

### Choosing the Right Module System

#### Use CommonJS when:
1. Working with older Node.js applications
2. Need compatibility with npm packages that use CommonJS
3. Working with legacy codebases
4. Need synchronous module loading
5. Using tools that don't support ESM

#### Use ESM when:
1. Building modern web applications
2. Need tree-shaking for smaller bundle sizes
3. Working with browser-based code
4. Want better static analysis
5. Using modern build tools (Vite, Webpack 5+)

#### Use TypeScript Modules when:
1. Building type-safe applications
2. Need better IDE support
3. Want to catch errors at compile time
4. Working with complex type definitions
5. Need to share types between modules

### Module System Configuration

1. **CommonJS Configuration** (`tsconfig.json`):
   ```json
   {
     "compilerOptions": {
       "module": "CommonJS",
       "esModuleInterop": true
     }
   }
   ```

2. **ESM Configuration** (`tsconfig.json`):
   ```json
   {
     "compilerOptions": {
       "module": "ESNext",
       "moduleResolution": "node"
     }
   }
   ```

3. **Package.json Configuration**:
   ```json
   {
     "type": "module"  // For ESM
     // or
     "type": "commonjs"  // For CommonJS (default)
   }
   ```

### Best Practices

1. **Consistency**:
   - Stick to one module system within a project
   - Use consistent import/export syntax
   - Follow project conventions

2. **TypeScript Projects**:
   - Use TypeScript's module system
   - Let the compiler handle module resolution
   - Use type definitions for better IDE support

3. **Node.js Projects**:
   - Consider CommonJS for traditional applications
   - Use ESM for modern applications
   - Configure `esModuleInterop` for better compatibility

4. **Web Projects**:
   - Prefer ESM for better tree-shaking
   - Use TypeScript for type safety
   - Consider build tools that support both systems

### Migration Considerations

1. **CommonJS to ESM**:
   - Update file extensions
   - Change require() to import
   - Update package.json
   - Handle dynamic imports

2. **ESM to CommonJS**:
   - Change import to require()
   - Update module.exports
   - Handle default exports
   - Update build configuration

3. **Adding TypeScript**:
   - Add type definitions
   - Configure tsconfig.json
   - Update build process
   - Add type checking

### Our Project's Choice

We use CommonJS in our project because:
1. It's the traditional choice for Node.js/Express applications
2. Better compatibility with npm packages
3. Simpler configuration
4. Well-tested in production
5. Easier to understand for beginners 