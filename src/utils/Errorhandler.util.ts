import { NextFunction, Response, Request } from "express";

class ErrorHandler extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

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
