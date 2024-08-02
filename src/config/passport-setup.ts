import passport from "passport";
import { Strategy as FaceBookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as InstagramStrategy } from "passport-instagram";
import { Strategy as LocalStrategy } from "passport-local";
import userModel from "../models/user.model";
import { comparepassword } from "../utils/auth.utils";
passport.use(
  new GoogleStrategy (
    {
      clientID: "90210359696-1u6t1ludve6tdcs6pge6fcj4nckqs64i.apps.googleusercontent.com",
    //   clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: "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",
    //   clientSecret: process.env.GOOGLE_SECRET_ID as string,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const ExistingUser = await userModel.findOne({
        "oauth2.providerId": profile.id,
        "oauth2.provider": 'google',
      });
      if (ExistingUser) {
        return done(null, ExistingUser);
      }

      const newUser = new userModel({
        username: profile.displayName,
        email: profile.emails ? profile.emails[0].value : "",
        oauth2: {
          provider: 'google',
          providerId: profile.id,
          token: accessToken,
          refreshedToken: refreshToken,
        },
      });
      await newUser.save();
      done(null, newUser);
    }
  )
);
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await userModel.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      const isMatch = comparepassword(password, user.passwordHash);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      done(null, user);
    }
  )
);
passport.serializeUser(function (user: any, done) {
  return done(null, user.id);
});
passport.deserializeUser(async (id: string, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});
