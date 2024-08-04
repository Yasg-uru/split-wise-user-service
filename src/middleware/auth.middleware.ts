import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/ErrorHandler.util";
import { Reqwithuser } from "../types/reqtype";
export const isAuthenticated = (
  req: Reqwithuser,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ErrorHandler(400, "please login to continue"));
  }
  console.log("this is a token :", token);
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decoded) {
    return next(new ErrorHandler(400, "please login to continue"));
  }
  console.log("this is a decoded data", decoded);

  req.user = decoded;
  next();
};
