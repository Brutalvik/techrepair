/**
 * Vercel Serverless Function Bridge
 * This file wraps the Fastify application logic to run as a single Vercel/Next.js API route handler.
 * * NOTE: This relies on the 'routes' folder being located in the root directory of your Next.js project.
 * Vercel will automatically inject the DATABASE_URL and other environment variables.
 */

import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyPostgres from "@fastify/postgres";

//\/app/api/[[...route]] path.
import healthRoutes from "../../../routes/health.mjs";
import bookingRoutes from "../../../routes/bookings.mjs";
import adminRoutes from "../../../routes/admin.mjs";

// Global variable to hold the initialized Fastify server instance
let fastifyApp = null;

async function buildFastifyApp() {
  if (fastifyApp) {
    return fastifyApp;
  }

  // Initialize Fastify
  // Logger is set to false to prevent excessive logging in Vercel/Cloud logs.
  const fastify = Fastify({ logger: false });

  // 1. Plugins
  await fastify.register(cors, {
    origin: true, // Allows all origins (your Vercel frontend)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Database Connection: Uses DATABASE_URL injected by Vercel secrets
  //
  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Register Routes
  // Fastify will map the routes defined inside these modules to Vercel's /api/* path
  await fastify.register(healthRoutes);
  await fastify.register(bookingRoutes, { prefix: "/api" });
  await fastify.register(adminRoutes, { prefix: "/api" });

  fastifyApp = fastify;
  return fastifyApp;
}

// Handler functions required by Next.js API Routes (Serverless Functions)

const handler = async (req, res) => {
  const app = await buildFastifyApp();

  // Core bridge logic: We use a Promise and Fastify's internal event emitter
  // to process the Next.js Request/Response objects correctly.
  return new Promise((resolve) => {
    app.server.emit("request", req, {
      // This mocking is necessary because Fastify expects Node.js http objects,
      // while Vercel/Next.js uses standard Web Request/Response.
      end: (body) =>
        resolve(
          new Response(body, {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        ),
      setHeader: (name, value) => {},
      writeHead: (statusCode) => {},
    });
  });
};

// Next.js/Vercel requires these named exports for each HTTP verb.
export { handler as GET, handler as POST, handler as PATCH };
