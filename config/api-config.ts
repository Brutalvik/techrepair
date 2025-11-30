/**
 * API Configuration: Centralized base URL for development and production.
 * * Vercel/Next.js automatically proxies relative paths (e.g., '/api/...') to
 * Serverless Functions in production.
 * * During local development (NODE_ENV === 'development'), we must explicitly
 * target the Fastify server's port (9000).
 */
export const API_BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:9000" : "";
