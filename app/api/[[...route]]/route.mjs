/**
 * Vercel Serverless Function Bridge
 * FIX: Uses URL manipulation to correctly resolve the path segments expected by Fastify's router.
 */

import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyPostgres from "@fastify/postgres";

// Import your modular route definitions from the root 'routes' folder
import healthRoutes from "../../../routes/health.mjs";
import bookingRoutes from "../../../routes/bookings.mjs";
import adminRoutes from "../../../routes/admin.mjs";

// Global variable to hold the initialized Fastify server instance
let fastifyApp = null;

async function buildFastifyApp() {
  if (fastifyApp) {
    return fastifyApp;
  }

  const fastify = Fastify({ logger: false });

  // 1. Plugins
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"], // Added HEAD for good measure
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Database Connection
  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Register Routes
  // Note: Health check is registered at the root (/) which Vercel maps to /api
  await fastify.register(healthRoutes);
  await fastify.register(bookingRoutes, { prefix: "/api" });
  await fastify.register(adminRoutes, { prefix: "/api" });

  // IMPORTANT: Wait for Fastify to be fully ready (routes registered, plugins loaded)
  await fastify.ready();

  fastifyApp = fastify;
  return fastifyApp;
}

// Ensure the app is built during the cold start phase
const FASTIFY_APP_PROMISE = buildFastifyApp();

// --- CORE EXECUTOR ---
const executeFastifyRequest = async (req, method) => {
  const app = await FASTIFY_APP_PROMISE; // Wait for initialization

  // 1. Get the raw path from Vercel's Request object
  const url = new URL(req.url);

  // 2. CRITICAL PATH CLEANUP:
  // Fastify needs '/api/bookings' but req.url might be 'https://domain/api/bookings'
  // We keep the full path because the routes were registered with '/api' prefix.
  const path = url.pathname;

  let body = undefined;
  if (method === "POST" || method === "PATCH") {
    try {
      // Need to clone the request stream to read the body only once
      body = await req.clone().json();
    } catch (e) {
      // Log this but proceed, let Fastify's router validate the body structure
      console.warn("Could not parse request body for injection.");
      body = {};
    }
  }

  return new Promise((resolve) => {
    app.inject(
      {
        method: method,
        url: path, // Use the full path
        headers: Object.fromEntries(req.headers.entries()),
        payload: body ? JSON.stringify(body) : undefined,
      },
      (err, response) => {
        if (err) {
          console.error("Fastify Injection Error:", err);
          return resolve(
            new Response(
              JSON.stringify({
                error: "Internal Server Error",
                details: err.message,
              }),
              { status: 500 }
            )
          );
        }

        // Return Vercel standard Response object
        resolve(
          new Response(response.body, {
            status: response.statusCode,
            headers: {
              "Content-Type":
                response.headers["content-type"] || "application/json",
            },
          })
        );
      }
    );
  });
};

// --- EXPORTED HANDLERS ---
// We define individual handlers to ensure Vercel's router works correctly.

export async function GET(req) {
  return executeFastifyRequest(req, "GET");
}

export async function POST(req) {
  return executeFastifyRequest(req, "POST");
}

export async function PATCH(req) {
  return executeFastifyRequest(req, "PATCH");
}

// Add OPTIONS handler required for Preflight checks (CORS)
export async function OPTIONS(req) {
  return executeFastifyRequest(req, "OPTIONS");
}
