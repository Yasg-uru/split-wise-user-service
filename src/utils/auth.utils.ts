import bcrypt from "bcrypt";
import crypto from "crypto";

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