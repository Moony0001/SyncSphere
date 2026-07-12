import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";
import { newUserPayload, registerAgent } from "./helpers.js";

// ---------------------------------------------------------------------------
// Auth controller: /api/auth
// ---------------------------------------------------------------------------
// Anatomy of a test:
//   describe(...)  groups related tests
//   it(...)        one test case ("it should ...")
//   Arrange        set up data
//   Act            make the request
//   Assert         expect(...) the outcome
// `it.fails(...)` marks a test we EXPECT to fail because of a known bug: it
// stays green while the bug exists, and turns red (alerting us) once fixed.
// ---------------------------------------------------------------------------

describe("POST /api/auth/signup", () => {
  it("creates a user, returns 201 and sets a jwt cookie", async () => {
    const res = await request(app).post("/api/auth/signup").send(newUserPayload());

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.email).toContain("@example.com");
    // The password must never be returned to the client.
    expect(res.body).not.toHaveProperty("password");
    // Auth is cookie based: a Set-Cookie header with the jwt should be present.
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.join(";")).toContain("jwt=");

    // And the user should actually exist in the database.
    const inDb = await User.countDocuments({ email: res.body.email });
    expect(inDb).toBe(1);
  });

  it("rejects an invalid email format with 400", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send(newUserPayload({ email: "not-an-email" }));

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid email/i);
  });

  it("rejects a password shorter than 8 characters with 400", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send(newUserPayload({ password: "short" }));

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/8 characters/i);
  });

  // FIXED (#7): the duplicate-email branch now returns, so no second write /
  // second response happens. We can test it cleanly.
  it("rejects a duplicate email with 400 and creates no second user", async () => {
    const payload = newUserPayload();
    await request(app).post("/api/auth/signup").send(payload); // first: ok

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...payload, firstname: "Second" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already taken/i);

    const count = await User.countDocuments({ email: payload.email });
    expect(count).toBe(1);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials and returns 200 + cookie", async () => {
    const { payload } = await registerAgent();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: payload.email, password: payload.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.join(";")).toContain("jwt=");
  });

  it("rejects a wrong password with 400", async () => {
    const { payload } = await registerAgent();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: payload.email, password: "wrongpassword" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("rejects a non-existent email with 400 (no user enumeration)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "whatever123" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/me (protected)", () => {
  it("returns the current user when authenticated", async () => {
    const { agent, user } = await registerAgent();

    const res = await agent.get("/api/auth/me");

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(user._id);
    expect(res.body).not.toHaveProperty("password");
  });

  it("returns 401 when no cookie is sent (protectRoute guard)", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/unauthorized/i);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie and returns 200", async () => {
    const { agent } = await registerAgent();

    const res = await agent.post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/logged out/i);
  });
});
