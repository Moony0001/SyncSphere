import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createClub, deleteClub, editClub, getClubs, getMyClubs, inviteUser, joinClub, leaveClub, searchClubs } from "../controllers/club.controllers.js";

const router = express.Router();

router.get("/:id", protectRoute, getClubs);
router.get("/myclubs/:id", protectRoute, getMyClubs);
router.get("/", protectRoute, searchClubs);
router.post("/new", protectRoute, createClub);
router.post("/join/:id", protectRoute, joinClub);
router.post("/leave/:id", protectRoute, leaveClub);
router.post("/invite/:userId/:clubId", protectRoute, inviteUser);
router.post("/edit/:id", protectRoute, editClub);
router.delete("/:id", protectRoute, deleteClub);

export default router;