import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from env");
  }

  if (isConnected) {
    return console.log("MongoDB is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "auth-example",
    });

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};
