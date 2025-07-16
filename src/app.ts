import Fastify, { FastifyInstance } from 'fastify';
// import dotenv from 'dotenv';

// dotenv.config();

export async function createApp(): Promise<FastifyInstance> {
    const app = Fastify({
        // logger: {
        //     level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
        // },
    });
    //homepage route
    app.get('/', async (req, reply) => {
        return reply.status(200).type('text/html').send(html)
    })

    // Health check endpoint
    app.get('/api/health', async (request, reply) => {
        return reply.send({
            success: true,
            message: 'API is running',
            timestamp: new Date().toISOString(),
        });
    });

    // 404 handler
    app.setNotFoundHandler((request, reply) => {
        return reply.status(404).send({
            success: false,
            message: 'Route not found',
        });
    });

    // Error handler

    return app;
}

export default createApp;

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
    />
    <title>Vercel + Fastify Hello World</title>
    <meta
      name="description"
      content="This is a starter template for Vercel + Fastify."
    />
  </head>
  <body>
    <h1>Vercel + Fastify Hello World</h1>
  </body>
</html>
`