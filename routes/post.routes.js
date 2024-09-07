import express from "express";
import { PostModel } from "../models/post.Schema.js";

export const postRouter = express.Router();

// create post
postRouter.post("/new", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    const myPost = await post.save();
    return res.status(201).send(myPost);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

// update post
postRouter.put("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await PostModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(202).send("your post is updated");
    } else {
      return res.status(203).send("You can update only your post");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

// delete post
postRouter.delete("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await post.deleteOne();
      return res.status(200).send("Post has been deleted");
    } else {
      return res.status(203).send("You can only delete your post");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

// like and dislike
postRouter.put("/:id/like", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
      await post.save();
      return res.status(202).send("You liked a post");
    } else {
      post.likes.pull(req.body.userId);
      await post.save();
      return res.status(403).send("You disliked post");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

// get post
postRouter.get("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      throw new Error("Resource not found");
    }
    return res.status(200).send(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});
