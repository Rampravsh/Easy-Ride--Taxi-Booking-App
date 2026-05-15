import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

/**
 * Global OpenAPI Registry
 * All modular documentation will register their schemas and paths here.
 */
export const registry = new OpenAPIRegistry();
