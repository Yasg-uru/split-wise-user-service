import { connect } from "http2";
import mongoose from "mongoose";
async function connnectDatabase() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`data base connected successfully`);
  } catch (error) {
    console.log("error is occured in database connectivity");
    process.exit(1);
  }
}
export default connnectDatabase;
