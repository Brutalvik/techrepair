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
  // Note: req.url includes the domain and path segment from the Vercel invocation
  const url = new URL(req.url);

  // 2. CRITICAL PATH CLEANUP: Get the path Fastify expects (e.g., /api/admin/bookings)
  const path = url.pathname + url.search; // Include search params in the URL

  // Normalize Headers to a simple object for Fastify injection
  const headers = Object.fromEntries(req.headers.entries());

  let body = undefined;
  if (method === "POST" || method === "PATCH") {
    try {
      // Read the body for POST/PATCH. Use req.clone() as the stream might be consumed elsewhere.
      body = await req.clone().json();
    } catch (e) {
      // If body parsing fails (e.g., empty body), pass empty object
      body = {};
    }
  }

  return new Promise((resolve) => {
    app.inject(
      {
        method: method,
        url: path,
        headers: headers, // Pass all headers
        payload: body ? JSON.stringify(body) : undefined, // Stringify payload if present
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

export async function GET(req) {
  return executeFastifyRequest(req, "GET");
}

export async function POST(req) {
  return executeFastifyRequest(req, "POST");
}

export async function PATCH(req) {
  return executeFastifyRequest(req, "PATCH");
}

export async function OPTIONS(req) {
  return executeFastifyRequest(req, "OPTIONS");
}
