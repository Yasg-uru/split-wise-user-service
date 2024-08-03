import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import connnectDatabase from "./utils/connectDb";
import { errorMiddleware } from "./middleware/err.middleware";
import cors from "cors";
import GroupRouter from "./route/group.route";
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/group", GroupRouter);

connnectDatabase();

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is Fire at port :${port}`);
});
