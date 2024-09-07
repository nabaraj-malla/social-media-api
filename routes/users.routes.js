import express from "express";
import bcrypt from "bcrypt";

const userRouter = express.Router();

import { UserModel } from "../models/user.Schema.js";
import mongoose from "mongoose";

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
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "server error",
    });
  }
});

// update user
userRouter.put("/:id", async (req, res) => {
  try {
    if (req.params.id === req.body.userId) {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      await UserModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      // await UserModel.findByIdAndUpdate(req.params.id, {
      //   desc: req.body.desc,
      // });

      return res.status(202).send("User updated successfully");
    } else {
      return res.status(404).send("id not found");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

// delete user
userRouter.delete("/:id", async (req, res) => {
  try {
    if (req.params.id == req.body.userId) {
      const userIdToDelete = req.params.id;
      console.log(typeof userIdToDelete);
      console.log(typeof new mongoose.Types.ObjectId(userIdToDelete));
      const user = await UserModel.findById(userIdToDelete);
      if (!user) {
        return res.status(200).send("user has been deleted before");
      }
      console.log("user", user);
      await UserModel.findByIdAndDelete(userIdToDelete);
      return res.status(200).send("user has been deleted");
    }
    return res.status(404).send("user not found");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

// get a user
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select(
      "username email -_id"
    );
    return res.status(200).send(user);

    // const user = await UserModel.findById(req.params.id);
    // console.log(user._doc);
    // const { password, profilePicture, coverPicture, ...other } = user._doc;
    // return res.status(200).send(other);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

// follow
userRouter.put("/:id/follow", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const follower_user = await UserModel.findById(req.body.userId);
      const following_user = await UserModel.findById(req.params.id);
      // console.log(
      //   `follower_user = ${follower_user} \n following_user = ${following_user}`
      // );
      if (!follower_user.following.includes(req.params.id)) {
        following_user.followers.push(req.body.userId);
        following_user.save();

        follower_user.following.push(req.params.id);
        follower_user.save();
        return res.status(202).send("You followed user");
      } else {
        return res.status(403).send("You already followed");
      }

      // const testPopulateFollowing = await UserModel.findById(
      //   req.params.id
      // ).populate("followers");

      // const testPopulateFollower = await UserModel.findById(
      //   req.body.userId
      // ).populate("following");
      // console.log("testPopulateFollowing", testPopulateFollowing.followers);
      // console.log("testPopulateFollower", testPopulateFollower.following);
      // await follower_user.updateOne({ $push: following_user });
    } else {
      return res.status(403).send("You can't folow yourself");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

// unfollow user
userRouter.put("/:id/unfollow", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const follower_user = await UserModel.findById(req.body.userId);
      const following_user = await UserModel.findById(req.params.id);
      // console.log(
      //   `follower_user = ${follower_user} \n following_user = ${following_user}`
      // );
      if (follower_user.following.includes(req.params.id)) {
        following_user.followers.pull(req.body.userId);
        following_user.save();

        follower_user.following.pull(req.params.id);
        follower_user.save();
        return res.status(202).send("You unfollowed user");
      } else {
        return res.status(403).send("You have not followed yet");
      }
    } else {
      return res.status(403).send("You can't unfolow yourself");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

export default userRouter;
