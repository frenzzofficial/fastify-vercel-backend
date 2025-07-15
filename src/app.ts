
// api/index.js - Main Vercel serverless function
import Fastify from 'fastify';
// import cors from '@fastify/cors';
// import jwt from '@fastify/jwt';

// Create Fastify instance
const app = Fastify({
    logger: process.env.NODE_ENV === 'development'
});

// // Register plugins
// app.register(cors, {
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true
// });

// app.register(jwt, {
//     secret: process.env.JWT_SECRET || ''
// });

// Routes
// Register homepage app route
app.get("/", async (_req, reply) => {
    reply.status(200)
        .header("Content-Type", "application/json; charset=utf-8")
        .send("Server is fast with fastify");
});


export default app;