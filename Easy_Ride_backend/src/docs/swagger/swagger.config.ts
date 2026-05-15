import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';
import { registerSecuritySchemes } from './swagger.security';
import '../routes'; // Register all paths

// Initialize security schemes
registerSecuritySchemes();

/**
 * Swagger Base Configuration
 */
export const swaggerConfig = {
  openapi: '3.1.0',
  info: {
    title: 'Easy Ride - Enterprise Ride Booking API',
    description: `
## Realtime Ride-Booking API Documentation
Welcome to the official documentation for the Easy Ride Backend Platform.

### Key Features:
- **Authentication**: Firebase-based authentication with role-based access control.
- **Rides**: Realtime ride matching, tracking, and pooling.
- **Payments**: Integrated Razorpay infrastructure for seamless transactions.
- **Communication**: Chat and Voice calling capabilities.
- **Observability**: Comprehensive logging and analytics.

### Authentication
Most endpoints require a valid Firebase ID Token in the Authorization header.
Format: \`Bearer <FIREBASE_TOKEN>\`
    `,
    version: '1.0.0',
    contact: {
      name: 'Easy Ride Support',
      email: 'support@easyride.com',
      url: 'https://easyride.com/developers',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Main API v1',
    },
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
};

/**
 * Generate OpenAPI Document
 */
export const generateOpenApiDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  
  return generator.generateDocument({
    ...swaggerConfig,
  } as any);
};
