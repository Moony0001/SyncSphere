import { describe, it, expect } from "vitest";
import { registerAgent } from "./helpers.js";
import Notification from "../models/notification.model.js";

// ---------------------------------------------------------------------------
// Notification controller: /api/notifications
// ---------------------------------------------------------------------------

describe("GET /api/notifications", () => {
  it("returns the current user's notifications", async () => {
    // When user A follows user B, the followUser controller creates a
    // notification addressed to user B. We use that as our fixture.
    const { agent: a } = await registerAgent();
    const { agent: b, user: bUser } = await registerAgent();

    await a.post(`/api/user/follow/${bUser._id}`);

    const res = await b.get("/api/notifications");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe("follow");
    expect(res.body[0].to).toBe(bUser._id);
  });

  it("marks notifications as read in the database after fetching", async () => {
    const { agent: a } = await registerAgent();
    const { agent: b, user: bUser } = await registerAgent();

    await a.post(`/api/user/follow/${bUser._id}`);
    await b.get("/api/notifications"); // fetching flips read -> true

    const inDb = await Notification.find({ to: bUser._id });
    expect(inDb).toHaveLength(1);
    expect(inDb[0].read).toBe(true);
  });

  it("returns an empty array for a user with no notifications", async () => {
    const { agent } = await registerAgent();

    const res = await agent.get("/api/notifications");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
