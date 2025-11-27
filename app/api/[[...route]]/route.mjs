/**
 * Vercel Serverless Function Bridge
 * FIX: Adjusts route registration and path injection to avoid 404/405 errors caused by ambiguous '/api' prefixing.
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Database Connection
  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Register Routes
  // CRITICAL CHANGE: Register all routes at the root (/) level of the Fastify router.
  // We will clean the incoming Vercel URL to match this format.
  await fastify.register(healthRoutes);
  await fastify.register(bookingRoutes); // Removed { prefix: "/api" }
  await fastify.register(adminRoutes); // Removed { prefix: "/api" }

  await fastify.ready();

  fastifyApp = fastify;
  return fastifyApp;
}

// Ensure the app is built during the cold start phase
const FASTIFY_APP_PROMISE = buildFastifyApp();

// --- CORE EXECUTOR ---
const executeFastifyRequest = async (req, method) => {
  const app = await FASTIFY_APP_PROMISE; // Wait for initialization

  const url = new URL(req.url);

  // CRITICAL PATH RESOLUTION:
  // 1. Get the path (e.g., /api/admin/bookings)
  let path = url.pathname;

  // 2. Remove the leading '/api' segment ONLY if it exists, to match Fastify's root registration.
  // Example: /api/admin/bookings -> /admin/bookings
  if (path.startsWith("/api")) {
    path = path.substring(4); // Remove "/api"
  }

  // 3. Re-add search parameters
  path = path + url.search;

  const headers = Object.fromEntries(req.headers.entries());

  let body = undefined;
  if (method === "POST" || method === "PATCH") {
    try {
      body = await req.clone().json();
    } catch (e) {
      body = {};
    }
  }

  return new Promise((resolve) => {
    app.inject(
      {
        method: method,
        url: path, // Inject the cleaned path (e.g., /admin/bookings)
        headers: headers,
        payload: body ? JSON.stringify(body) : undefined,
      },
      (err, response) => {
        if (err) {
          console.error("Fastify Injection Error:", err);
          // Return 500 status on internal Fastify failure
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
