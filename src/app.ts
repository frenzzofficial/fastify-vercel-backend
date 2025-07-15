import Fastify, { FastifyReply, FastifyRequest } from "fastify";

const app = Fastify({
    logger: process.env.NODE_ENV === "development",
});

app.get(
    "/",
    {
        schema: {
            response: {
                200: {
                    type: "string",
                },
            },
        },
    },
    async (_req: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).type("text/html").send(html);
    }
);

// Health check
app.get("/health",
    {
        schema: {
            response: {
                200: {
                    type: "json/string",
                },
            },
        },
    },
    async (_req, reply) => {
        // return { status: 'ok', timestamp: new Date().toISOString() };
        reply
            .status(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send(new Date().toISOString() + " Server is healthy");
    });

//not found page app route
app.get("/*", (_req, reply) => {
    reply
        .status(404)
        .header("Content-Type", "application/json; charset=utf-8")
        .send("Error 404, URL not found");
});

export const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: #000000;
        text-align: center;
    }
    title{
        padding :10px;
    }
    </style>
    <title>Fastify Backend</title>
  </head>
  <body>
    <h1>Vercel Fastify template by @vivekcsein</h1>
  </body>
</html>
`;
export default app;
