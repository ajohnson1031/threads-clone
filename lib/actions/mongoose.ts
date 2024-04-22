import { config } from "@/config";
import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!config.MONGODB_URL) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(config.MONGODB_URL);

    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

export { connectToDB };
