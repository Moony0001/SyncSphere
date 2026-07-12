import { beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// ---------------------------------------------------------------------------
// Global test setup
// ---------------------------------------------------------------------------
// This file runs before the test suite. It:
//   1. Provides the environment variables the controllers/middleware rely on.
//   2. Spins up a real MongoDB server that lives entirely in RAM.
//   3. Wipes every collection between tests so tests can't leak state.
//   4. Tears everything down at the end.
// ---------------------------------------------------------------------------

// protectRoute + generateToken read these at runtime. We set them BEFORE any
// app code runs so the JWTs sign/verify with a known secret.
process.env.JWT_SECRET = "test-secret";
// IMPORTANT: generateToken sets the cookie with `secure: NODE_ENV !== "development"`.
// A `Secure` cookie is only sent back over HTTPS, but supertest talks plain HTTP,
// so its cookie jar would drop it and every protected route would 401. Running
// the tests as "development" keeps the cookie non-secure so auth works over HTTP.
process.env.NODE_ENV = "development";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  // Isolation: clear all documents so each test starts from a clean database.
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
