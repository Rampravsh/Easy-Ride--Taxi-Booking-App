import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Easy Ride API Documentation',
      version: '1.0.0',
      description: 'Production-grade ride-booking platform API',
      contact: {
        name: 'Easy Ride Engineering',
        email: 'rampraveshkr4545@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.easyride.com/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase ID Token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
        Ride: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            rider: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['searching', 'accepted', 'arriving', 'started', 'completed', 'cancelled'] 
            },
            pickupCoordinates: {
              type: 'array',
              items: { type: 'number' },
              minItems: 2,
              maxItems: 2,
            },
            fare: { type: 'number' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.model.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
