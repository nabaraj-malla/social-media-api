import express from "express";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  return res.send("Welcome to user routes");
});

export default userRouter;
