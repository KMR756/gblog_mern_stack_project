import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `mongoDB connected!!DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("mongoDB connection faild!", error);
    process.exit(1);
  }
};
export default connectDB;
