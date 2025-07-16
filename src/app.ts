import Fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

export async function createApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: {
            level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
        },
    });

    app.get('/', async (request, reply) => {
        return reply.send({
            success: true,
            message: 'HomePage Eoute',
        });

    });

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