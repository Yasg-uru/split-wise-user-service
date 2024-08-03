import mongoose, { mongo, ObjectId, Schema } from "mongoose";
export interface IGroup extends Document {
  groupId: Schema.Types.ObjectId;
  name: string;
  description: string;
  members: {
    userId: Schema.Types.ObjectId;
    role: string;
  }[];
  settings: {
    currency: string;
    defaultSplitType: string; // e.g., equal, percentage
    privacy: string; // e.g., public, private
    inviteLink: string; // For inviting new members
    notificationPreferences: {
      // Group-level notification settings
      expenseUpdates: boolean;
      memberActivity: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema<IGroup> = new Schema<IGroup>({
  groupId: { type: Schema.Types.ObjectId, required: true, auto: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["admin", "member"], default: "member" },
    },
  ],
  settings: {
    currency: { type: String, required: true },
    defaultSplitType: {
      type: String,
      enum: ["equal", "percentage"],
      default: "equal",
    },
    privacy: { type: String, enum: ["public", "private"], default: "private" },
    inviteLink: { type: String, required: false },
    notificationPreferences: {
      expenseUpdates: { type: Boolean, default: true },
      memberActivity: { type: Boolean, default: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const GroupModel = mongoose.model<IGroup>("Group", GroupSchema);
export default GroupModel;
