import { Response, Request, NextFunction } from "express";
import GroupModel from "../models/group.model";
import ErrorHandler from "../utils/ErrorHandler.util";
import { Schema } from "mongoose";
import crypto from "crypto";
import GroupInvite from "../models/groupInvite.model";

class GroupController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, members, settings } = req.body;
      const newGroup = new GroupModel({
        name,
        description,
        members,
        settings,
      });
      await newGroup.save();
      res.status(200).json({
        message: "successfully created group",
        group: newGroup,
      });
    } catch (error) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async details(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const group = await GroupModel.findById(groupId);
      if (!groupId) {
        return next(new ErrorHandler(404, "group not found "));
      }
      res.status(200).json({
        message: "successfully fetched group details",
        group,
      });
    } catch (error) {
      next(new ErrorHandler(500, "Internal server error"));
    }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;

      const updatedgroup = await GroupModel.findByIdAndUpdate(
        groupId,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedgroup) {
        return next(new ErrorHandler(404, "Failed to update"));
      }
      res.status(200).json({
        message: "updated successfully",
        updatedgroup,
      });
    } catch (error) {
      next(new ErrorHandler(500, "Internal server error"));
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;

      const updatedgroup = await GroupModel.findByIdAndDelete(groupId);
      if (!updatedgroup) {
        return next(new ErrorHandler(404, "Failed to delete"));
      }
      res.status(200).json({
        message: "deleted successfully",
        updatedgroup,
      });
    } catch (error) {
      next(new ErrorHandler(500, "Internal server error"));
    }
  }
  static async ListUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const groups = await GroupModel.find({ "members.userId": userId });
      if (!groups) {
        return next(new ErrorHandler(404, "Groups not found"));
      }
      res.status(200).json({
        message: "successfuly fetched your groups",
        groups,
      });
    } catch (error) {
      next(new ErrorHandler(500, "Internal server error"));
    }
  }
  static async addmember(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      const { groupId } = req.params;
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return next(new ErrorHandler(404, "User not found"));
      }
      group.members.push({
        userId: userId as Schema.Types.ObjectId,
        role: "member",
      });
      await group.save();
      res.status(200).json({
        message: "member added successfully",
        group,
      });
    } catch (error: any) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async removemember(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId, groupId } = req.params;
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return next(new ErrorHandler(404, "group not found"));
      }
      group.members = group.members.filter(
        (member) => member._id?.toString() !== memberId.toString()
      );
      await group.save();
      res.status(200).json({
        message: "removed successfully",
        group,
      });
    } catch (error) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId, groupId } = req.params;
      const { role } = req.body;
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return next(new ErrorHandler(404, "group not found"));
      }
      const member = group.members.find(
        (member) => member._id?.toString() === memberId.toString()
      );
      if (!member) {
        return next(new ErrorHandler(404, "Member not found"));
      }
      member.role = role;
      await group.save();
      res.status(200).json({
        message: "Successfully updated role of the member",
        group,
      });
    } catch (error) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async updatesetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { newSettings } = req.body;
      const { groupId } = req.params;
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return next(new ErrorHandler(404, "group not found"));
      }
      group.settings = newSettings;
      await group.save();
      res.status(200).json({
        message: "settings updated successfully",
        group,
      });
    } catch (error) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async createInviteLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { groupId } = req.params;
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return next(new ErrorHandler(404, "Group not found"));
    }
    const inviteLink = crypto.randomBytes(20).toString("hex");
    group.settings.inviteLink = inviteLink;
    await group.save();
    res.status(200).json({
      message: "successfully created invite link",
      group,
    });
  }
  static async sendgroupinvite(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { groupId } = req.params;
      const { inviterId, inviteeEmail, expiresAt } = req.body;
      if (!inviterId || !inviteeEmail || !expiresAt) {
        return next(new ErrorHandler(404, "Required fields are missing "));
      }
      const newInviteGroup = new GroupInvite({
        groupId,
        inviterId,
        inviteeEmail,
        expiresAt,
        status: "pending",
      });
      await newInviteGroup.save();
      res.status(201).json({
        message: "successfully send group invitation",
        newInviteGroup,
      });
    } catch (error) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async getInviteDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { groupId, inviteId } = req.params;
      const invite = await GroupInvite.findOne({ groupId, inviteId });
      if (!invite) {
        return next(new ErrorHandler(404, "Invite not found"));
      }
      if (invite.expiresAt < new Date()) {
        return next(new ErrorHandler(400, "invite expires"));
      }
      res.status(200).json({
        message: "fetched your invite ",
        invite,
      });
    } catch (error) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async updatestatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const { inviteId } = req.params;
      const invite = await GroupInvite.findOne({ inviteId });
      if (!invite) {
        return next(new ErrorHandler(404, "invite not found "));
      }
      invite.status = status;
      await invite.save();
      if (invite.status === "accepted") {
        const group = await GroupModel.findById(invite.groupId);
        if (!group) {
          return next(new ErrorHandler(404, "group not found "));
        }
        const isMember = group.members.find(
          (member) => member.userId.toString() === invite.inviteId.toString()
        );
        if (isMember) {
          return next(
            new ErrorHandler(400, "User is already a member of the group")
          );
        }
        group.members.push({
          userId: invite.inviteId as unknown as Schema.Types.ObjectId,
          role: "member",
        });
        await group.save();
        res.status(200).json({
          message: "successfully joined this group ",
          group,
        });
      }
      res.status(200).json({
        message: "successfully updated their status",
        invite,
      });
    } catch (error) {
      next(new ErrorHandler(500, "internal server error"));
    }
  }
  static async ListInvites(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const invites = await GroupInvite.findOne({ groupId });
      if (!invites) {
        return next(new ErrorHandler(404, "not invites found"));
      }
      res.status(200).json({
        message: "successfully fetched your invites",
        invites,
      });
    } catch (error) {
      next(new ErrorHandler(500, "Internal server error"));
    }
  }
  static async updateNotificationPreference(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { groupId } = req.params;
      const { expenseUpdates, memberActivity } = req.body;
      const group = await GroupModel.findById(groupId);

      if (!group) {
        return next(new ErrorHandler(404, "group not found "));
      }
      group.settings.notificationPreferences.expenseUpdates = expenseUpdates;
      group.settings.notificationPreferences.memberActivity = memberActivity;
      await group.save();
      res.status(200).json({
        message: "updated your notification settings successfully",
        group,
      });
    } catch (error) {
      next(new ErrorHandler(500, "Internal server error"));
    }
  }
}
export default GroupController;
