import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";

import userRouter from "./routes/users.routes.js";
import { postRouter } from "./routes/post.routes.js";
dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/users", userRouter);
app.use("/api/post", postRouter);

async function connectMongoDb() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to mongodb");
}

const PORT = 8089;

app.listen(PORT, () => {
  console.log(`Server is listening at port no. ${PORT}`);
  connectMongoDb();
});
