import express from "express";
import { getMe, signup, login, logout, googleauth, googleauthCallback} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/googleauth", googleauth);
router.get("/googleauth/callback", googleauthCallback);

export default router;