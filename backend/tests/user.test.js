import { describe, it, expect } from "vitest";
import { registerAgent } from "./helpers.js";
import User from "../models/user.model.js";

// ---------------------------------------------------------------------------
// User controller: /api/user
// ---------------------------------------------------------------------------

describe("GET /api/user/profile/:id", () => {
  it("returns a user's public profile without the password", async () => {
    const { agent } = await registerAgent();
    const { user: other } = await registerAgent();

    const res = await agent.get(`/api/user/profile/${other._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(other._id);
    expect(res.body).not.toHaveProperty("password");
  });
});

describe("POST /api/user/follow/:id", () => {
  it("follows another user and records the relationship", async () => {
    const { agent, user: me } = await registerAgent();
    const { user: other } = await registerAgent();

    const res = await agent.post(`/api/user/follow/${other._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/followed/i);

    const meInDb = await User.findById(me._id);
    const otherInDb = await User.findById(other._id);
    expect(meInDb.following.map(String)).toContain(other._id);
    expect(otherInDb.followers.map(String)).toContain(me._id);
  });

  it("unfollows when called a second time (toggle)", async () => {
    const { agent, user: me } = await registerAgent();
    const { user: other } = await registerAgent();

    await agent.post(`/api/user/follow/${other._id}`); // follow
    const res = await agent.post(`/api/user/follow/${other._id}`); // unfollow

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/unfollowed/i);

    const meInDb = await User.findById(me._id);
    expect(meInDb.following.map(String)).not.toContain(other._id);
  });

  it("does not allow following yourself (403)", async () => {
    const { agent, user: me } = await registerAgent();

    const res = await agent.post(`/api/user/follow/${me._id}`);

    expect(res.status).toBe(403);
  });
});

describe("GET /api/user/suggested", () => {
  it("returns a list of users you are not following", async () => {
    const { agent } = await registerAgent();
    await registerAgent(); // create a couple of other users to suggest
    await registerAgent();

    const res = await agent.get("/api/user/suggested");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // No suggested user should include a password field.
    for (const u of res.body) expect(u).not.toHaveProperty("password");
  });
});

describe("POST /api/user/update", () => {
  it("updates simple profile fields (bio, weight)", async () => {
    const { agent, user: me } = await registerAgent();

    const res = await agent
      .post("/api/user/update")
      .send({ bio: "I love running", weight: 72 });

    expect(res.status).toBe(200);
    expect(res.body.bio).toBe("I love running");
    expect(res.body.weight).toBe(72);
    expect(res.body).not.toHaveProperty("password");

    const inDb = await User.findById(me._id);
    expect(inDb.bio).toBe("I love running");
  });

  it("rejects a password change that supplies only the new password (400)", async () => {
    const { agent } = await registerAgent();

    const res = await agent
      .post("/api/user/update")
      .send({ newPassword: "brandnewpass" }); // missing currentPassword

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/both/i);
  });
});
