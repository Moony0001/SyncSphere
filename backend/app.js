import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import clubRoutes from "./routes/club.routes.js";

// This module builds and EXPORTS the Express app WITHOUT starting a server
// (no app.listen) and WITHOUT connecting to a database. That separation is
// what makes the app importable from tests: supertest can drive `app`
// directly, and the tests supply their own in-memory database.

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse rich URL-encoded bodies
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/clubs", clubRoutes);

// In production the same Express process also serves the built frontend.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

export default app;
