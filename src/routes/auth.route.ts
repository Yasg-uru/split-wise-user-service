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
  profile,
  ForgotPassword,
  ResetPassword,
  logout,
} from "../controllers/auth.controller";
import { checkstrategy } from "../middlewares/checkauthstrategy.middleware";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

// OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, (req, res) => {
  const { token } = req.user as any;
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
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
router.post("/login", login);

router.post("/signup", signup);
router.post("/forgot/password", checkstrategy("local"), ForgotPassword);
router.post("/reset", ResetPassword);

// Profile route
router.get("/profile", profile);
router.post("/logout",logout);

export default router;
