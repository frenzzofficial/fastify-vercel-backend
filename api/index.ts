import app from '../src/app';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import fastifyPlugin from 'fastify-plugin';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {

    app.register(cors, {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    });

    app.register(jwt, {
        secret: process.env.JWT_SECRET || ''
    });

    // Health check
    app.get('/health', async (_req, reply) => {
        // return { status: 'ok', timestamp: new Date().toISOString() };
        reply.status(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send(new Date().toISOString() + ' Server is healthy');
    });

    //not found page app route
    app.get("/*", (_req, reply) => {
        reply.status(404)
            .header("Content-Type", "application/json; charset=utf-8")
            .send("Error 404, URL not found");
    });

    // Register plugins
    await app.register(
        fastifyPlugin((fastify, _opts, done) => {
            //register all plugins
            fastify.ready((err) => {
                if (err) {
                    console.error("Error connecting to any plugin:", err);
                    process.exit(1);
                }
                console.log("Successfully connected to all plugins");
            });
            done();
        })
    );
    await app.ready();
    app.server.emit('request', req, res);
};
