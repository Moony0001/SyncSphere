import { describe, it, expect } from "vitest";
import { registerAgent } from "./helpers.js";
import Club from "../models/club.model.js";
import Notification from "../models/notification.model.js";

// ---------------------------------------------------------------------------
// Club controller: /api/clubs
// ---------------------------------------------------------------------------

// Small helper: create a club as the given agent and return its JSON body.
async function createClub(agent, overrides = {}) {
  const res = await agent.post("/api/clubs/new").send({
    name: "Trail Blazers",
    location: "Gwalior",
    description: "A running club",
    sport: "Running",
    club_type: "Club",
    ...overrides,
  });
  return res;
}

describe("POST /api/clubs/new", () => {
  it("creates a club and returns 201", async () => {
    const { agent } = await registerAgent();

    const res = await createClub(agent);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Trail Blazers");
  });
});

describe("GET /api/clubs/:id", () => {
  it("fetches a single club by id", async () => {
    const { agent } = await registerAgent();
    const created = await createClub(agent);

    const res = await agent.get(`/api/clubs/${created.body._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(created.body._id);
  });
});

describe("GET /api/clubs (search)", () => {
  it("finds clubs by name (case-insensitive)", async () => {
    const { agent } = await registerAgent();
    await createClub(agent, { name: "Sunrise Cyclists" });

    const res = await agent.get("/api/clubs").query({ clubname: "sunrise" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Sunrise Cyclists");
  });

  it("returns an empty array when no filters are given", async () => {
    const { agent } = await registerAgent();
    await createClub(agent);

    const res = await agent.get("/api/clubs");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  // FIXED (#13): the `scope` query param now maps to the real `club_type` field.
  it("filters clubs by club type", async () => {
    const { agent } = await registerAgent();
    await createClub(agent, { name: "Racers United", club_type: "Racing Team" });

    // searchClubs reads the `scope` query param for club type.
    const res = await agent.get("/api/clubs").query({ scope: "Racing Team" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("POST /api/clubs/join/:id", () => {
  it("adds the user to the club's members in the DB", async () => {
    const { agent: owner } = await registerAgent();
    const created = await createClub(owner);

    const { agent: joiner, user: joinerUser } = await registerAgent();
    const res = await joiner.post(`/api/clubs/join/${created.body._id}`);

    expect(res.status).toBe(200);
    const inDb = await Club.findById(created.body._id);
    expect(inDb.members.map(String)).toContain(joinerUser._id);
  });

  // FIXED (stale response): joinClub now returns the UPDATED member list.
  it("returns the updated member list including the new member", async () => {
    const { agent: owner } = await registerAgent();
    const created = await createClub(owner);

    const { agent: joiner, user: joinerUser } = await registerAgent();
    const res = await joiner.post(`/api/clubs/join/${created.body._id}`);

    expect(res.body).toHaveLength(1);
    expect(res.body.map(String)).toContain(joinerUser._id);
  });

  // FIXED (dup guard): joining twice is rejected.
  it("rejects joining a club you are already in (400)", async () => {
    const { agent: owner } = await registerAgent();
    const created = await createClub(owner);

    const { agent: joiner } = await registerAgent();
    await joiner.post(`/api/clubs/join/${created.body._id}`);
    const res = await joiner.post(`/api/clubs/join/${created.body._id}`);

    expect(res.status).toBe(400);
  });
});

describe("POST /api/clubs/leave/:id", () => {
  it("removes the user from the club's members", async () => {
    const { agent: owner } = await registerAgent();
    const created = await createClub(owner);

    const { agent: joiner, user: joinerUser } = await registerAgent();
    await joiner.post(`/api/clubs/join/${created.body._id}`);

    const res = await joiner.post(`/api/clubs/leave/${created.body._id}`);

    expect(res.status).toBe(200);
    const inDb = await Club.findById(created.body._id);
    expect(inDb.members.map(String)).not.toContain(joinerUser._id);
  });
});

describe("POST /api/clubs/invite/:userId/:clubId", () => {
  // FIXED (#9): Notification is now imported AND saved.
  it("persists a club-invite notification", async () => {
    const { agent: owner } = await registerAgent();
    const created = await createClub(owner);
    const { user: invitee } = await registerAgent();

    const res = await owner.post(
      `/api/clubs/invite/${invitee._id}/${created.body._id}`
    );

    expect(res.status).toBe(200);
    const count = await Notification.countDocuments({
      to: invitee._id,
      category: "club_invite",
    });
    expect(count).toBe(1);
  });
});

describe("DELETE /api/clubs/:id", () => {
  it("lets an admin delete their club (200)", async () => {
    const { agent, user: me } = await registerAgent();
    // Create the club with ourselves as an admin so we're authorized to delete.
    const created = await createClub(agent, { admins: [me._id] });

    const res = await agent.delete(`/api/clubs/${created.body._id}`);

    expect(res.status).toBe(200);
    const inDb = await Club.findById(created.body._id);
    expect(inDb).toBeNull();
  });

  it("blocks a non-admin from deleting a club (401)", async () => {
    const { agent: owner, user: ownerUser } = await registerAgent();
    const created = await createClub(owner, { admins: [ownerUser._id] });

    const { agent: stranger } = await registerAgent();
    const res = await stranger.delete(`/api/clubs/${created.body._id}`);

    expect(res.status).toBe(401);
  });
});
