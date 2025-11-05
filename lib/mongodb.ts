// lib/mongodb.ts
// Centralized MongoDB connection helper for Next.js (App Router) using Mongoose and TypeScript.
// - Ensures a single connection across hot reloads in development by caching in globalThis.
// - Throws early if the required MONGODB_URI env variable is missing.
// - Export a typed async function that returns the active Mongoose instance.

import mongoose, { type Mongoose } from 'mongoose';

// Read and validate the MongoDB connection string from env.
// Include the database name in the URI (e.g., mongodb+srv://.../mydb) or set it via connection options.
const MONGODB_URI: string = process.env.MONGODB_URI!; // non-null assertion for typing; runtime check below keeps safety
if (!MONGODB_URI) {
  throw new Error('Missing environment variable: MONGODB_URI');
}

// Shape of the cached connection/promise we keep on globalThis to avoid multiple connects in dev.
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Augment globalThis with a typed cache slot. The var keyword is required for global augmentation.
declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

// Initialize the cache once per process.
const cached: MongooseCache = global.__mongooseCache ?? { conn: null, promise: null };
if (!global.__mongooseCache) {
  global.__mongooseCache = cached;
}

/**
 * Establish (or reuse) a MongoDB connection via Mongoose.
 * - In development, Next.js reloads modules; we cache the connection across reloads to prevent creating
 *   multiple concurrent connections.
 * - In production, this function resolves quickly on subsequent calls since the connection already exists.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If we already have a live connection, return it.
  if (cached.conn) return cached.conn;

  // If a connection is in-flight, await it.
  if (!cached.promise) {
    // You can set additional options here if needed (e.g., dbName) — the URI usually encodes dbName.
    // Avoid passing untyped options; rely on defaults unless you have a specific need.
      const opts = {
          bufferCommands: false,
      };
      cached.promise = mongoose.connect(MONGODB_URI, opts).catch((error) => {
          console.error('MongoDB connection error:', error);
          throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
