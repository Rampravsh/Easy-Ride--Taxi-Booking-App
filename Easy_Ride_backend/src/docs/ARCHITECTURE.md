# Enterprise Swagger Documentation Architecture

This project uses a modular, scalable approach to API documentation using **OpenAPI 3.1**, **TypeScript**, and **Zod**.

## Architecture Components

### 1. Global Registry (`src/docs/swagger/openapi.ts`)
We use `@asteasolutions/zod-to-openapi` to create a centralized registry. All modules register their schemas and paths here. This avoids giant, unmaintainable JSON/YAML files.

### 2. Modular Route Docs (`src/docs/routes/*.docs.ts`)
Each feature module (Auth, Ride, User, etc.) has its own documentation file. These files:
- Import the global registry.
- Use Zod schemas for request/response validation and documentation.
- Define paths, methods, tags, and security requirements.

### 3. Centralized Schemas (`src/docs/swagger/swagger.schemas.ts`)
Common entities like `User`, `Ride`, and `Transaction` are defined as Zod schemas and registered globally. This ensures consistency across different API endpoints.

### 4. Standardized Responses (`src/docs/swagger/swagger.responses.ts`)
We use helper functions to generate standardized success, error, and paginated response schemas. This ensures the frontend receives a predictable data structure.

### 5. Swagger UI Setup (`src/docs/swagger/swagger.setup.ts`)
Express middleware that:
- Generates the OpenAPI JSON on the fly from the registry.
- Serves the Swagger UI at `/api/docs`.
- Provides an endpoint for raw OpenAPI JSON at `/api/docs-json`.

## How to add a new endpoint documentation

1. **Define/Update Schemas**: If the endpoint uses new data structures, add them to `src/docs/swagger/swagger.schemas.ts`.
2. **Create/Update Route Docs**: Open the corresponding `.docs.ts` file in `src/docs/routes/`.
3. **Register Path**: Use \`registry.registerPath({...})\` to define the endpoint details.
4. **Link Zod Schemas**: Reference your Zod schemas in the \`request\` and \`responses\` sections.

## Best Practices
- **Never Duplicate**: Always use \`registry.register\` for reusable schemas.
- **Strict Typing**: Use Zod's \`infer\` to keep your TypeScript types in sync with your documentation.
- **Security First**: Always specify \`security: [{ firebaseAuth: [] }]\` for protected routes.
- **Examples**: Provide realistic examples using \`SWAGGER_EXAMPLES\` to help frontend developers.

## Exporting Documentation
You can get the raw OpenAPI JSON by visiting:
\`GET http://localhost:5000/api/docs-json\`

This JSON can be imported into Postman, Insomnia, or used to generate client-side SDKs.
