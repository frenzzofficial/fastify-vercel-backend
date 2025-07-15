import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import fastifyPlugin from 'fastify-plugin';
// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
    app.register(
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
}