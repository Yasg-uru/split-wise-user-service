import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const comparepassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
export const HashedPassword = async (password: string): Promise<string> => {
  let saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
};

export const generateResetToken = async () => {
  return crypto.randomBytes(20).toString("hex");
};
export const hashResetToken = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, 10);
};
export const generateToken = async (user: User) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "2d",
  });
};
export const verify = async (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    console.log("error is occured:", error);
  }
};
