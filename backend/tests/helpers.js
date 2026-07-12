import request from "supertest";
import app from "../app.js";
import Post from "../models/post.model.js";

// ---------------------------------------------------------------------------
// Shared test helpers
// ---------------------------------------------------------------------------

/**
 * Build a valid signup payload. Each call uses a unique email so multiple
 * users can be created inside a single test without colliding on the unique
 * email index.
 */
export const newUserPayload = (overrides = {}) => ({
  firstname: "Test",
  lastname: "User",
  email: `user_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
  password: "password123",
  gender: "male",
  ...overrides,
});

/**
 * Sign up a fresh user and return a supertest "agent". An agent automatically
 * stores the httpOnly `jwt` cookie set by signup and re-sends it on every
 * subsequent request, so we can hit protected routes as this user.
 *
 * Returns { agent, user, payload }:
 *   - agent   -> authenticated supertest agent
 *   - user    -> the JSON body returned by signup (has _id, firstname, ...)
 *   - payload -> the raw signup payload (handy for logging back in)
 */
export async function registerAgent(overrides = {}) {
  const agent = request.agent(app);
  const payload = newUserPayload(overrides);
  const res = await agent.post("/api/auth/signup").send(payload);
  return { agent, user: res.body, payload };
}

/**
 * Insert a Post directly through the Mongoose model, bypassing the (currently
 * broken) createPost controller. We fill in every field the Post schema marks
 * as required so the document is valid. This lets us test like/comment/delete
 * behaviour against a real post.
 */
export async function createRawPost(userId, overrides = {}) {
  return Post.create({
    user: userId,
    title: "My Ride",
    text: "A nice ride",
    sport: "Running",
    time: "00:30:00",
    distance: 5,
    ...overrides,
  });
}
