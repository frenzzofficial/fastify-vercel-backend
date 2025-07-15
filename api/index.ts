import app from '../src/app';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, reply: VercelResponse) {
    await app.ready()
    app.server.emit('request', req, reply)
}