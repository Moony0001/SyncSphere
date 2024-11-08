import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { createClub, deleteClub, editClub, getClubs, getMyClubs, inviteUser, joinClub, leaveClub, searchClubs } from "../controllers/club.controllers";

const router = express.Router();

router.get("/:id", protectRoute, getClubs);
router.get("/myclubs/:id", protectRoute, getMyClubs);
router.get("/search/:name", protectRoute, searchClubs);
router.post("/new", protectRoute, createClub);
router.post("/join/:id", protectRoute, joinClub);
router.post("/leave/:id", protectRoute, leaveClub);
router.post("/invite/:userId/:clubId", protectRoute, inviteUser);
router.post("/edit/:id", protectRoute, editClub);
router.delete("/:id", protectRoute, deleteClub);