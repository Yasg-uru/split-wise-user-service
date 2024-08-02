import mongoose, { Schema, Document, mongo } from "mongoose";
export interface User extends Document {
  username: string;
  email: string;
  passwordHash: string;
  oauth2: {
    provider: string;
    providerId: string;
    token: string;
    refreshedToken: string;
  };
  resetpasswordToken: string | undefined;
  resetpasswordTokenExpire: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}
const UserSchema: Schema<User> = new Schema<User>(
  {
    username: {
      type: String,
      required: [true, "user name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    passwordHash: {
      type: String,
    },
    oauth2: {
      provider: {
        type: String,
      },
      providerId: String,
      token: String,
      refreshedToken: String,
    },
    resetpasswordToken: {
      type: String,
    },
    resetpasswordTokenExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model<User>("User", UserSchema);
export default userModel;
