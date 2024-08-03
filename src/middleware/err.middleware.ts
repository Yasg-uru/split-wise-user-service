import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler.util";
export const errorMiddleware = (
  err: Error, // Use ErrorHandler here for type checking
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ErrorHandler) {
    const { statusCode, message } = err;

    return res.status(statusCode).json({ message });
  }

  // Handle other errors
  console.error(err); // Log the error details for debugging
  return res.status(500).json({ message: "Internal server error" });
};

export default ErrorHandler;
