import Fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import dotenv from 'dotenv';

// Import routes
// import authRoutes from './api/auth';
// import adminRoutes from './api/admin';
// import userRoutes from './api/users';

// Import middleware
// import { errorHandler } from './middleware/errorHandler';
// import { connectDatabase } from './config/database';

dotenv.config();

const createApp = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: {
            level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
        },
    });

    // Register security plugins
    await app.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    });

    // Register CORS
    await app.register(cors, {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Register rate limiting
    await app.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        errorResponseBuilder: (_request, context) => {
            return {
                success: false,
                message: `Rate limit exceeded, retry in ${context.after}`,
            };
        },
    });

    // Register JWT
    await app.register(jwt, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        cookie: {
            cookieName: 'token',
            signed: false,
        },
    });

    // Register cookie support
    await app.register(cookie, {
        secret: process.env.COOKIE_SECRET || 'your-cookie-secret',
        parseOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        },
    });

    // Register Swagger for API documentation
    // await app.register(swagger, {
    //     swagger: {
    //         info: {
    //             title: 'Fastify API',
    //             description: 'Secure Fastify API with JWT Authentication',
    //             version: '1.0.0',
    //         },
    //         host: process.env.NODE_ENV === 'production' ? 'your-domain.vercel.app' : 'localhost:3000',
    //         schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
    //         consumes: ['application/json'],
    //         produces: ['application/json'],
    //         securityDefinitions: {
    //             cookieAuth: {
    //                 type: 'apiKey',
    //                 name: 'token',
    //                 in: 'cookie',
    //             },
    //         },
    //     },
    // });

    // await app.register(swaggerUI, {
    //     routePrefix: '/documentation',
    //     uiConfig: {
    //         docExpansion: 'full',
    //         deepLinking: false,
    //     },
    // });

    // Connect to database
    // await connectDatabase();

    // Health check endpoint
    app.get('/', async (_request, reply) => {
        return reply.send({
            success: true,
            message: 'Fastify API is running',
            timestamp: new Date().toISOString(),
        });
    });

    // Register routes
    // await app.register(authRoutes, { prefix: '/api/auth' });
    // await app.register(adminRoutes, { prefix: '/api/admin' });
    // await app.register(userRoutes, { prefix: '/api/users' });

    // Health check endpoint
    app.get('/api/health', async (_request, reply) => {
        return reply.send({
            success: true,
            message: 'API is running',
            timestamp: new Date().toISOString(),
        });
    });

    // 404 handler
    app.setNotFoundHandler((_request, reply) => {
        return reply.status(404).send({
            success: false,
            message: 'Route not found',
        });
    });

    // Error handler
    // app.setErrorHandler(errorHandler);

    return app;
}

export default createApp;