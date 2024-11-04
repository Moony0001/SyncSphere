import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { commentOnPost, createPost, deletePost, getFollowingPosts, getMyActivities, getUserPosts, likePost } from "../controllers/post.controllers";


const router = express.Router();

router.get("/following", protectRoute, getFollowingPosts);
router.get("/myactivities", protectRoute, getMyActivities);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;