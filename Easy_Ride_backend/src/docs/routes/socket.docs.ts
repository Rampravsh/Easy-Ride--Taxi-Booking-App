import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { z } from 'zod';

/**
 * Socket.IO Events Documentation
 * 
 * Note: These are not REST endpoints, but documented here for developer convenience.
 */

registry.registerPath({
  method: 'get',
  path: '/sockets/info',
  summary: 'Socket.IO Connection Details',
  description: `
### Connection
- **URL**: \`/\`
- **Auth**: Pass Firebase token in \`auth\` object or \`Authorization\` header.

### Events (Emit)
- \`ride:update-location\`: Send current latitude/longitude.
- \`chat:send-message\`: Send a message to a ride room.

### Events (Listen)
- \`ride:status-changed\`: Triggered when ride status updates.
- \`chat:receive-message\`: Triggered when a new message arrives.
  `,
  tags: [SWAGGER_TAGS.SOCKET],
  responses: {
    200: {
      description: 'Socket documentation section',
    },
  },
});
