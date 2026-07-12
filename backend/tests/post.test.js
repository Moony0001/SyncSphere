import { describe, it, expect } from "vitest";
import { registerAgent, createRawPost } from "./helpers.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// ---------------------------------------------------------------------------
// Post controller: /api/post
// ---------------------------------------------------------------------------
// Several handlers here are broken, so many of these use `it.fails`. Note the
// trick we use: because createPost is broken, we insert posts DIRECTLY with the
// Mongoose model (createRawPost) so we can still test like/comment/delete.
// ---------------------------------------------------------------------------

describe("GET /api/post/following", () => {
  it("returns posts authored by users you follow", async () => {
    const { agent, user: me } = await registerAgent();
    const { user: author } = await registerAgent();

    // I follow the author, and the author has a post.
    await agent.post(`/api/user/follow/${author._id}`);
    await createRawPost(author._id, { title: "Author's ride" });

    const res = await agent.get("/api/post/following");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Author's ride");
    // The author should be populated (an object), not just an id.
    expect(res.body[0].user).toHaveProperty("firstname");
  });

  it("returns an empty array when you follow nobody", async () => {
    const { agent } = await registerAgent();
    const res = await agent.get("/api/post/following");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe("POST /api/post/create", () => {
  // FIXED (#2): createPost now accepts and stores the required activity fields.
  it("creates an activity post and returns 201", async () => {
    const { agent, user: me } = await registerAgent();

    const res = await agent.post("/api/post/create").send({
      title: "Morning Run",
      text: "Felt great",
      sport: "Running",
      time: "00:30:00",
      distance: 5,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Morning Run");

    // The user's activities list is kept in sync (fixes the always-0 count).
    const inDb = await User.findById(me._id);
    expect(inDb.activities.map(String)).toContain(res.body._id);
  });

  it("rejects a post missing required activity fields with 400", async () => {
    const { agent } = await registerAgent();

    const res = await agent.post("/api/post/create").send({ text: "no title" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/post/myactivities", () => {
  // FIXED (#3): uses the authenticated user's id directly.
  it("returns the current user's own posts", async () => {
    const { agent, user: me } = await registerAgent();
    await createRawPost(me._id);

    const res = await agent.get("/api/post/myactivities");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("GET /api/post/user/:id", () => {
  // FIXED (#4): looks the user up by id.
  it("returns a given user's posts", async () => {
    const { agent, user: me } = await registerAgent();
    await createRawPost(me._id);

    const res = await agent.get(`/api/post/user/${me._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("POST /api/post/like/:id", () => {
  // FIXED (#8): the notification is now built from req.user with an icon fallback.
  it("likes another user's post and returns 200 with the updated likes", async () => {
    const { agent, user: me } = await registerAgent();
    const { user: author } = await registerAgent();
    const post = await createRawPost(author._id);

    const res = await agent.post(`/api/post/like/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.map(String)).toContain(me._id);
  });

  it("does not allow liking your own post (401)", async () => {
    const { agent, user: me } = await registerAgent();
    const post = await createRawPost(me._id);

    const res = await agent.post(`/api/post/like/${post._id}`);

    expect(res.status).toBe(401);
  });
});

describe("POST /api/post/comment/:id", () => {
  // FIXED (#5): reads req.params.id, and (with the schema fix #10) stores the text.
  it("adds a comment and returns the post with the comment text", async () => {
    const { agent } = await registerAgent();
    const { user: author } = await registerAgent();
    const post = await createRawPost(author._id);

    const res = await agent
      .post(`/api/post/comment/${post._id}`)
      .send({ text: "Nice pace!" });

    expect(res.status).toBe(200);
    expect(res.body.comments).toHaveLength(1);
    expect(res.body.comments[0].text).toBe("Nice pace!");
  });

  it("rejects an empty comment with 400", async () => {
    const { agent } = await registerAgent();
    const { user: author } = await registerAgent();
    const post = await createRawPost(author._id);

    const res = await agent.post(`/api/post/comment/${post._id}`).send({ text: "" });

    expect(res.status).toBe(400);
  });
});

describe("Post model: comments schema", () => {
  // FIXED (#10): comments now have a real `text` field.
  it("persists a comment's text field", async () => {
    const { user: me } = await registerAgent();
    const post = await createRawPost(me._id);

    post.comments.push({ user: me._id, text: "great ride" });
    await post.save();

    const reloaded = await Post.findById(post._id);
    expect(reloaded.comments[0].text).toBe("great ride");
  });
});

describe("DELETE /api/post/:id", () => {
  // FIXED (#6): reads req.params.id, and the pop() call is corrected.
  it("deletes your own post and returns 200", async () => {
    const { agent, user: me } = await registerAgent();
    const post = await createRawPost(me._id);

    const res = await agent.delete(`/api/post/${post._id}`);

    expect(res.status).toBe(200);
    const stillThere = await Post.findById(post._id);
    expect(stillThere).toBeNull();
  });

  it("does not let you delete someone else's post (401)", async () => {
    const { user: author } = await registerAgent();
    const { agent: stranger } = await registerAgent();
    const post = await createRawPost(author._id);

    const res = await stranger.delete(`/api/post/${post._id}`);

    expect(res.status).toBe(401);
  });
});
