// require("dotenv").config({ path: "./env" });
// it does not maintain consistency for import statement

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.on("error", (error) => {
      // using arrow function to catch error occured in connecting express and database
      console.log("Error occured in server", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error occured in connecting to database", err);
  });

/*
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); // using template string
    app.on("error", (error) => {
      // using arrow function to catch error occured in connecting express and database
      console.log("Error occured in server", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      // using arrow function to log the port on which server is running
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error ocuured in connectint to database", error);
    throw err;
  }
})(); // using IIFE to use async/await
*/
