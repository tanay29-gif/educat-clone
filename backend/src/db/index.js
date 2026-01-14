import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config({
    path: './.env'
});

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 5000;

const connectDB = async () => {
   try {
    await mongoose.connect(`${uri}/${dbName}`);

    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }

}
 
export default connectDB;

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
    }
}
