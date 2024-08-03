import mongoose, { Document, Schema, Types } from "mongoose";

// Define the GroupInvite interface
export interface IGroupInvite extends Document {
  inviteId: Types.ObjectId;
  groupId: Types.ObjectId;
  inviterId: Types.ObjectId;
  inviteeEmail: string;
  status: string; // e.g., pending, accepted, rejected
  createdAt: Date;
  expiresAt: Date;
}

// Create the GroupInvite schema
const GroupInviteSchema: Schema<IGroupInvite> = new Schema<IGroupInvite>(
  {
    inviteId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    inviterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    inviteeEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Create the GroupInvite model
const GroupInvite = mongoose.model<IGroupInvite>(
  "GroupInvite",
  GroupInviteSchema
);

export default GroupInvite;
