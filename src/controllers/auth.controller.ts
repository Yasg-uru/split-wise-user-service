import userModel from "../models/user.model";
import { Request, Response } from "express";
import { HashedPassword } from "../utils/auth.utils";
import passport from "passport";
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  session: true,
});

export const facebookAuth = passport.authenticate("facebook", {
  scope: ["email"],
});

export const facebookAuthCallback = passport.authenticate("facebook", {
  session: true,
});

export const instagramAuth = passport.authenticate("instagram");

export const instagramAuthCallback = passport.authenticate("instagram", {
  session: true,
});

export const login = passport.authenticate("local", { session: true });

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const ExistingUser = await userModel.findOne({ email });
    if (ExistingUser) {
      return res.status(400).json({
        message: "User Already Exist",
      });
    }
    const hashedPassword: string = await HashedPassword(password);

    const newUser = new userModel({
      username,
      email,
      passwordHash: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "successfully created your account",
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};
export const profile = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.send(`Hello, ${req.user}`);
    } else {
      res.redirect("/login");
    }
  };