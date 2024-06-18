import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import bookRouter from "./routes/book.js";
import roleRouter from "./routes/role.js";
import userRouter from "./routes/user.js";
import { seedBooksData } from "./seed.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://books-store-blue.vercel.app",
    ],
    credentials: true,
  })
);
app.use("/api/role", roleRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);

//Response handler
app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const message = obj.message || "Success!";
  return res.status(statusCode).json({
    success: [200, 201, 204].some((a) => a === obj.status) ? true : false,
    status: statusCode,
    message: message,
    data: obj.data,
  });
});

//Error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errorMessage,
    stack: err.stack,
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    if (process.argv.includes("--seed")) {
      await seedBooksData();
    }
    console.log("MongoDB is connected");
  } catch (error) {
    throw error;
  }
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  connectDB();
});
