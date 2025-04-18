import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import * as dotenv from 'dotenv';

dotenv.config();

export default fp(async (fastify) => {
  // Only register Swagger in development environment
    if (process.env.NODE_ENV == 'local' || 'production') {
    fastify.register(swagger, {
      openapi: {
        info: {
          title: 'SVC',
          description: '',
          version: '0.1.0',
        },
        servers: [
          {
            url:  process.env.NODE_ENV=="local"  ? `http://localhost:${process.env.PORT || 3000}` : `${process.env.SWAGGER_URL}`, 
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
            },
          },
        },
      },
      hideUntagged: false,
    });

    fastify.register(swaggerUi, {
      routePrefix: '/docs',
    });

    console.log('Swagger and Swagger UI are enabled in development mode.');
    } else {
    console.log('Swagger and Swagger UI are disabled in production mode.');
  }
});


