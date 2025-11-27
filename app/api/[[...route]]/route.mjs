/**
 * Vercel Serverless Function Bridge
 * FIX: Separates request methods (POST, PATCH) to ensure Vercel correctly routes the request verb.
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Register Routes
  await fastify.register(healthRoutes);
  await fastify.register(bookingRoutes, { prefix: "/api" });
  await fastify.register(adminRoutes, { prefix: "/api" });

  fastifyApp = fastify;
  return fastifyApp;
}

// --- CORE EXECUTOR ---
// This function manually processes the request using the Fastify instance
const executeFastifyRequest = async (req, method, body = null) => {
  const app = await buildFastifyApp();

  // Vercel/Next.js Request object is non-standard for Fastify,
  // so we must extract the URL, headers, and body manually.
  const url = new URL(req.url);
  const headers = {};
  for (const [key, value] of req.headers.entries()) {
    headers[key] = value;
  }

  // Fastify request object simulation
  const fastifyReq = {
    method: method,
    url: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers: headers,
    // Inject parsed JSON body for POST/PATCH requests
    body: body,
    // This is a minimal simulation, primarily targeting the router functionality
  };

  return new Promise((resolve) => {
    app.inject(
      {
        method: method,
        url: fastifyReq.url,
        headers: fastifyReq.headers,
        payload: body ? JSON.stringify(body) : undefined, // Pass payload as string
        query: fastifyReq.query,
      },
      (err, response) => {
        if (err) {
          console.error("Fastify Injection Error:", err);
          return resolve(
            new Response(JSON.stringify({ error: "Internal Server Error" }), {
              status: 500,
            })
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
// These export functions are what Vercel calls.

export async function GET(req) {
  // GET requests usually have query params and no body
  return executeFastifyRequest(req, "GET");
}

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body for POST
    return executeFastifyRequest(req, "POST", body);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json(); // Parse the request body for PATCH
    return executeFastifyRequest(req, "PATCH", body);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }
}
