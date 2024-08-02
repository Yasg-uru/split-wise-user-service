import { Request, Response, NextFunction } from "express";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({ message: "User is already logged in with another account." });
  }
  next();
};

export default checkAuth;
