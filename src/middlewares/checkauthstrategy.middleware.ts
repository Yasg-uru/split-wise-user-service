import { NextFunction, Response, Request } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/Errorhandler.util";
export const checkstrategy =  (strategy: "local" | "google") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // if (!req.isAuthenticated()) {
    //   return next(new ErrorHandler(403, "please login to continue"));
    // }
    console.log("this is a strategy:",strategy)
    console.log("this is a authinfo ",req.authInfo)
    next();
  };
};
