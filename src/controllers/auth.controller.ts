// import userModel from "../models/user.model";
// import { NextFunction, Request, Response } from "express";
// import {
//   generateResetToken,
//   HashedPassword,
//   hashResetToken,
// } from "../utils/auth.utils";
// import passport from "passport";
// import Errorhandler from "../utils/Errorhandler.util";
// import ErrorHandler from "../utils/Errorhandler.util";
// import { sendResetEmail } from "../utils/email.utils";
// export const googleAuth = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// export const googleAuthCallback = passport.authenticate("google", {
//   session: true,
// });

// export const facebookAuth = passport.authenticate("facebook", {
//   scope: ["email"],
// });

// export const facebookAuthCallback = passport.authenticate("facebook", {
//   session: true,
// });

// export const instagramAuth = passport.authenticate("instagram");

// export const instagramAuthCallback = passport.authenticate("instagram", {
//   session: true,
// });

// export const login = (req: Request, res: Response, next: NextFunction) => {
//   passport.authenticate("local", (err: any, user: any, info: any) => {
//     if (err) {
//       console.log("this is a error:", err);
//       return next(new ErrorHandler(500, "Internal server error"));
//     }
//     if (!user) return next(new ErrorHandler(400, info.message));
//     req.logIn(user, (err) => {
//       if (err) {
//         console.log("this is a error:", err);
//         return next(new ErrorHandler(500, "Internal server error"));
//       }
//       res.status(200).json({
//         message: "Logged in successfully",
//       });
//     });
//   })(req, res, next);
// };

// export const signup = async (req: Request, res: Response) => {
//   try {
//     const { username, email, password } = req.body;
//     const ExistingUser = await userModel.findOne({ email });
//     if (ExistingUser) {
//       return res.status(400).json({
//         message: "User Already Exist",
//       });
//     }
//     const hashedPassword: string = await HashedPassword(password);

//     const newUser = new userModel({
//       username,
//       email,
//       passwordHash: hashedPassword,
//     });
//     await newUser.save();
//     res.status(201).json({
//       message: "successfully created your account",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "internal server error",
//     });
//   }
// };
// export const ForgotPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return next(new ErrorHandler(404, "User not found with this email"));
//     }
//     const resetToken = await generateResetToken();
//     user.resetpasswordToken = await hashResetToken(resetToken);
//     user.resetpasswordTokenExpire = new Date(Date.now() + 3600000);
//     await user.save();
//     await sendResetEmail(email, resetToken);
//     res.status(200).json({
//       message: "password reset mail sent ",
//     });
//   } catch (error) {
//     next(new ErrorHandler(500, "Internal server error"));
//   }
// };
// export const ResetPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { token, newPassword } = req.body;
//     const user = await userModel.findOne({
//       resetpasswordToken: token,
//       resetpasswordTokenExpire: { $gt: new Date() },
//     });
//     if (!user) {
//       return next(new ErrorHandler(404, "user not found "));
//     }
//     user.passwordHash = await HashedPassword(newPassword);
//     user.resetpasswordToken = undefined;
//     user.resetpasswordTokenExpire = undefined;
//     await user.save();
//     res.status(200).json({
//       message: "password reset successfully",
//     });
//   } catch (error) {
//     next(new ErrorHandler(500, "Internal server error"));
//   }
// };
// export const profile = (req: Request, res: Response, next: NextFunction) => {
//   if (req.isAuthenticated()) {
//     res.status(200).json({
//       user: req.user,
//     });
//   } else {
//     next(new ErrorHandler(500, "Internal server error"));
//   }
// };
// export const logout = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   res.clearCookie("jwt", { httpOnly: true, secure: true, maxAge: 0 });
//   res.status(200).json({
//     message: "Logged out successfully",
//   });
// };
import userModel from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import {
  generateResetToken,
  HashedPassword,
  hashResetToken,
} from "../utils/auth.utils";
import passport from "passport";
import ErrorHandler from "../utils/Errorhandler.util";
import { sendResetEmail } from "../utils/email.utils";

// Google Authentication
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  session: true,
  failureRedirect: "/login",
});

// Facebook Authentication
export const facebookAuth = passport.authenticate("facebook", {
  scope: ["email"],
});

export const facebookAuthCallback = passport.authenticate("facebook", {
  session: true,
  failureRedirect: "/login",
});

// Instagram Authentication
export const instagramAuth = passport.authenticate("instagram");

export const instagramAuthCallback = passport.authenticate("instagram", {
  session: true,
  failureRedirect: "/login",
});

// Local Authentication - Login
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      console.log("Error during authentication:", err);
      return next(new ErrorHandler(500, "Internal server error"));
    }
    if (!user) {
      return next(new ErrorHandler(400, info.message));
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log("Error during login:", err);
        return next(new ErrorHandler(500, "Internal server error"));
      }
      const { token } = req.user as any;
      res.cookie("jwt", token, { httpOnly: true, secure: true });
      res.status(200).json({ message: "Logged in successfully" });
    });
  })(req, res, next);
};

// Local Authentication - Signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    console.log("this is a req.body:", req.body);
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler(400, "already user exist"));
    }
    const hashedPassword: string = await HashedPassword(password);
    const newUser = new userModel({
      username,
      email,
      passwordHash: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    next(new ErrorHandler(500, "Internal server error"));
  }
};

// Forgot Password
export const ForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ErrorHandler(404, "User not found with this email"));
    }
    const resetToken = await generateResetToken();
    user.resetpasswordToken = await hashResetToken(resetToken);
    user.resetpasswordTokenExpire = new Date(Date.now() + 3600000); // 1 hour expiry
    await user.save();
    await sendResetEmail(email, resetToken);
    res.status(200).json({
      message: "Password reset mail sent",
    });
  } catch (error) {
    next(new ErrorHandler(500, "Internal server error"));
  }
};

// Reset Password
export const ResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, newPassword } = req.body;
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpire: { $gt: new Date() },
    });
    if (!user) {
      return next(new ErrorHandler(404, "User not found or token expired"));
    }
    user.passwordHash = await HashedPassword(newPassword);
    user.resetpasswordToken = undefined;
    user.resetpasswordTokenExpire = undefined;
    await user.save();
    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    next(new ErrorHandler(500, "Internal server error"));
  }
};

// User Profile
export const profile = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      user: req.user,
    });
  } else {
    next(new ErrorHandler(401, "Unauthorized"));
  }
};

// Logout
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(new ErrorHandler(500, "Internal server error"));
    }
    res.clearCookie("jwt", { httpOnly: true, secure: true, maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  });
};
