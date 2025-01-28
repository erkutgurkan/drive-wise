import mongoose from "mongoose";

const MONGO_URI: string =
  process.env.MONGO_URI || "mongodb://localhost:27017/drivevise";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
