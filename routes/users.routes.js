import express from "express";
import bcrypt from "bcrypt";

const userRouter = express.Router();

import { UserModel } from "../models/user.Schema.js";

// user signup
userRouter.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    var result = {
      success: true,
      details: newUser,
    };
    return res.status(201).send(result);
  } catch (error) {
    result = {
      success: false,
    };
    console.log(error);
    return res.send(result);
  }
});

// user signin
userRouter.post("/signin", async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log("isPasswordMatched", isPasswordMatched);
    if (isPasswordMatched) {
      return res.status(200).send({
        login: "successfull",
      });
    } else {
      return res.status(401).send({
        login: "unsuccessfull",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "server error",
    });
  }
});

export default userRouter;
