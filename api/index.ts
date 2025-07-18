import App from "../src/app";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { FastifyInstance, HTTPMethods, LightMyRequestResponse } from "fastify";

let app: FastifyInstance | null = null;
const allowedMethods: HTTPMethods[] = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS",
    "HEAD",
];

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
): Promise<void> {
    try {
        if (!app) {
            app = await App();
            await app.ready();
        }

        const method: HTTPMethods =
            req.method && allowedMethods.includes(req.method as HTTPMethods)
                ? (req.method as HTTPMethods)
                : "GET";

        const response: any = app.inject({
            method: method as any,
            url: req.url || "/",
            headers: req.headers,
            payload: req.body,
        });

        res.status(response.statusCode);

        for (const [key, value] of Object.entries(response.headers)) {
            if (value !== undefined) {
                res.setHeader(key, value as string);
            }
        }

        const contentType = response.headers["content-type"];
        if (
            typeof contentType === "string" &&
            contentType.includes("application/json")
        ) {
            try {
                const parsed = JSON.parse(response.body as string);
                res.json(parsed);
            } catch {
                res
                    .status(500)
                    .json({ success: false, message: "Invalid JSON response from app." });
            }
        } else {
            res.send(response.body);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
