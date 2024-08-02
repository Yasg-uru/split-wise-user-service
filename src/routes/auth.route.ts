import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
  instagramAuth,
  instagramAuthCallback,
  login,
  signup,
  profile
} from "../controllers/auth.controller";

const router = Router();

// OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, (req, res) => {
  res.status(200).json({ message: "Successfully logged in with Google" });
});

router.get("/facebook", facebookAuth);
router.get("/facebook/callback", facebookAuthCallback, (req, res) => {
  res.redirect("/profile");
});

router.get("/instagram", instagramAuth);
router.get("/instagram/callback", instagramAuthCallback, (req, res) => {
  res.redirect("/profile");
});

// Local authentication routes
router.post("/login", login, (req, res) => {
  res.status(200).json({ message: "Logged in successfully" });
});

router.post("/signup", signup);

// Profile route
router.get("/profile", profile);

export default router;
