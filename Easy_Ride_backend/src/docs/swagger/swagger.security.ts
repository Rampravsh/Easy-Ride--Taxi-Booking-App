import { registry } from './registry';

/**
 * Register Security Schemes
 */
export const registerSecuritySchemes = () => {
  registry.registerComponent('securitySchemes', 'firebaseAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter your Firebase ID Token here.',
  });

  registry.registerComponent('securitySchemes', 'adminAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Admin-specific JWT token if applicable.',
  });
};
