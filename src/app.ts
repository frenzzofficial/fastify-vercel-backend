
// api/index.js - Main Vercel serverless function
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

// Create Fastify instance
const app = Fastify({
    logger: process.env.NODE_ENV === 'development'
});

// Register plugins
app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
});

app.register(jwt, {
    secret: process.env.JWT_SECRET || ''
});

// Routes
// Register homepage app route
app.get("/", async (_req, _reply) => {
    return "Server is fast with fastify";
});

// Health check
app.get('/health', async (_req, reply) => {
    // return { status: 'ok', timestamp: new Date().toISOString() };
    reply.status(200).send(new Date().toISOString() + ' Server is healthy');
});

//not found page app route
app.get("/*", (_req, reply) => {
    reply.status(404).send("Error 404, URL not found");
});

export default app;