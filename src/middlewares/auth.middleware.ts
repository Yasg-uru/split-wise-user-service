import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../utils/Errorhandler.util";
import { verify } from "../utils/auth.utils";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new ErrorHandler(400, "please login to continue"));
  }
  const decoded = verify(token);
  if (!decoded) {
    return next(new ErrorHandler(400, "please login to continue"));
  }
  req.user = decoded;
  next();
};
