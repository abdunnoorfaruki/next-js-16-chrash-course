import mongoose, { Connection } from 'mongoose';

/**
 * Type definition for the cached connection object
 * This ensures type safety and prevents using 'any'
 */
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

/**
 * Global cache for the MongoDB connection
 * In Next.js, modules can be cached in development mode, but during hot reload
 * or in serverless environments, new instances may be created.
 * This cache prevents multiple connections from being established.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Initialize the global mongoose cache if it doesn't exist
 * We use a global variable to persist the connection across hot reloads in development
 */
const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

// Assign the cache to global if it's not already set (development mode)
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Implements connection caching to prevent multiple connections during development
 *
 * @returns {Promise<Connection>} A promise that resolves to the Mongoose connection
 * @throws {Error} If MONGODB_URI environment variable is not set
 *
 * @example
 * ```typescript
 * import connectDB from '@/lib/mongodb';
 * await connectDB();
 * ```
 */
async function connectDB(): Promise<Connection> {
  // If we already have a cached connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no connection URI, throw an error
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // If there's a pending connection promise, wait for it instead of creating a new one
  if (cached.promise) {
    return cached.promise;
  }

  // Create a new connection promise
  cached.promise = mongoose
    .connect(mongoUri, {
      bufferCommands: false, // Disable mongoose buffering
    })
    .then((mongooseInstance) => {
      // Store the connection in the cache
      cached.conn = mongooseInstance.connection;
      return cached.conn;
    })
    .catch((error: Error) => {
      // On error, clear the promise cache so we can retry
      cached.promise = null;
      throw error;
    });

  return cached.promise;
}

export default connectDB;
