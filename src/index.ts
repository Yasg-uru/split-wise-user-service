import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import connectDatabase from "./utils/connectDatabase";
import authRouter from "./routes/auth.route";
import "./config/passport-setup";
import { errorMiddleware } from "./utils/Errorhandler.util";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Use the auth routes
app.use("/auth", authRouter);

// Connect to the database
connectDatabase();
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
