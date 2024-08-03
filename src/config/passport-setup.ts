import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import userModel from "../models/user.model";
import { comparepassword, generateToken } from "../utils/auth.utils";
import ErrorHandler from "../utils/Errorhandler.util";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "90210359696-1u6t1ludve6tdcs6pge6fcj4nckqs64i.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
      accessType: "offline" as any,
      prompt: "consent" as any,
    } as any,
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      console.log("Received refreshToken:", refreshToken); // Log the refreshToken
      try {
        const existingUser = await userModel.findOne({
          "oauth2.providerId": profile.id,
          "oauth2.provider": "google",
        });
        if (existingUser) {
          const token = await generateToken(existingUser);
          console.log("Existing user:", existingUser);
          return done(null, existingUser); // Return the user object directly
        }

        const newUser = new userModel({
          username: profile.displayName,
          email: profile.emails ? profile.emails[0].value : "",
          oauth2: {
            provider: "google",
            providerId: profile.id,
            token: accessToken,
            refreshedToken: refreshToken,
          },
          strategy: "google",
        });
        await newUser.save();

        console.log("New user created:", newUser);
        done(null, newUser); // Return the user object directly
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        done(new ErrorHandler(500, "Internal server error"));
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email: any, password: any, done: any) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (!user.passwordHash) {
          return done(
            null,
            false,
            new ErrorHandler(
              403,
              "User already logged in with another strategy"
            )
          );
        }
        const isMatch = await comparepassword(password, user.passwordHash);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        const token = await generateToken(user);
        done(null, user); // Return the user object directly
      } catch (error) {
        done(null, false, {
          message: "you are not logged with local strategy",
        });
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  console.log("Serializing user with this object:", user);
  return done(null, user._id); // Use _id directly from user object
});

passport.deserializeUser(async (id: string, done) => {
  console.log("Deserializing user by their id:", id);
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
