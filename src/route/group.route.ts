import { Router } from "express";
import GroupController from "../controller/group.controller";
const GroupRouter = Router();
GroupRouter.post("/create", GroupController.create);
GroupRouter.get("/:groupId", GroupController.details);
GroupRouter.put("/:groupId", GroupController.update);
GroupRouter.delete("/:groupId", GroupController.delete);
GroupRouter.get("/user/:userId/groups", GroupController.ListUser);
GroupRouter.post("/add/member/:groupId", GroupController.addmember);
GroupRouter.delete(
  "/remove/member/:groupId/:memberId",
  GroupController.removemember
);
GroupRouter.put("/update/role/:groupId/:memberId", GroupController.updateRole);
GroupRouter.put("/update/settings/:groupId", GroupController.updatesetting);
GroupRouter.post(
  "/generate/invitelink/:groupId",
  GroupController.createInviteLink
);
GroupRouter.post("/sendinvitelink/:groupId", GroupController.sendgroupinvite);
GroupRouter.get(
  "/invitedetails/:groupId/:inviteId",
  GroupController.getInviteDetails
);
GroupRouter.put("/update/status/:inviteId", GroupController.updatestatus);
GroupRouter.get("/listinvites/:groupId", GroupController.ListInvites);
GroupRouter.put(
  "/update/notification",
  GroupController.updateNotificationPreference
);

export default GroupRouter;
