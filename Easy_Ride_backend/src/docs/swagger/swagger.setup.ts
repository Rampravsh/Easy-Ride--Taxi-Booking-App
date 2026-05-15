import { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocument } from './swagger.config';

/**
 * Setup Swagger UI Middleware
 * @param app Express Application
 */
export const setupSwagger = (app: Application) => {
  const openApiDocument = generateOpenApiDocument();

  // Swagger UI Options
  const options: swaggerUi.SwaggerUiOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 3,
    },
    customSiteTitle: 'Easy Ride API Docs',
    customCss: `
      .swagger-ui .topbar { background-color: #000; }
      .swagger-ui .info .title { color: #1a73e8; }
      .swagger-ui .scheme-container { background: #f8f9fa; }
    `,
  };

  // Serve Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, options));

  // Serve OpenAPI JSON
  app.get('/api/docs-json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openApiDocument);
  });

  console.log('Swagger UI available at /api/docs');
};
