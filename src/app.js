import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // this method is used to enable CORS with middleware options
app.use(
  express.json({
    limit: "16kb",
  })
); // this method is used to recognize the incoming Request Object as a JSON Object
// sunmiting form data

app.use(express.urlencoded({ extended: true, limit: "16kb" })); // this method is used to recognize the incoming Request Object as strings or arrays
// it is used to convert space into recognisable characters

app.use(express.static("public")); // this method is used to serve static files

app.use(cookieParser()); // this method is used to parse Cookie header and populate req.cookies with an object keyed by the cookie names

//routes import

import userRouter from "./routes/user.routes.js";

// routes declaration
// since we have segregated rotes and controllers so we cannot use app.get() method here
// instead we will use middleware to use the routes

app.use("/api/v1/users", userRouter);
// it is good practice to use versioning and decalring api if creating api  in routes

// url will be https://localhost:8000/api/v1/users/register

export default app;
