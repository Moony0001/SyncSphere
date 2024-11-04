import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications } from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);

export default router;