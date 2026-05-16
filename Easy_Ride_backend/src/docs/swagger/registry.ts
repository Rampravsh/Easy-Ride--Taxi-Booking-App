import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

/**
 * Extend Zod with OpenAPI functionality
 * This must be called BEFORE using any registry.register calls
 */
extendZodWithOpenApi(z);

/**
 * Global OpenAPI Registry
 * All modular documentation will register their schemas and paths here.
 */
export const registry = new OpenAPIRegistry();
