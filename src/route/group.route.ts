import { Router } from "express";
import GroupController from "../controller/group.controller";
const GroupRouter = Router();
GroupRouter.post("/create", GroupController.create);
GroupRouter.get("/:groupId", GroupController.details);

export default GroupRouter;
