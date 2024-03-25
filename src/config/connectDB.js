/** CONNECTING TO MONGODB */
import mongoose from "mongoose";

export default async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(`There was an Error: ${error.message}`);
    process.exit(1);
  }
};
