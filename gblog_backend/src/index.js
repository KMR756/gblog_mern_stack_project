import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./dataBase/connectDB.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection faild", err);
  });
