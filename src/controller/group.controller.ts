import { Response, Request, NextFunction } from "express";
import GroupModel from "../models/group.model";
import ErrorHandler from "../utils/ErrorHandler.util";

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
}
export default GroupController;
