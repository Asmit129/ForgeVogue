import mongoose from "mongoose";
import User from "./backend/models/User.js";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({});
  console.log("Testing with user:", user._id);
  
  try {
    user.name = "Test Name";
    await user.save();
    console.log("Save successful!");
  } catch (e) {
    console.error("Save failed:", e);
  }
  process.exit(0);
}
test();
