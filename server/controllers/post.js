"use strict";
import User from "../models/user";
import Post from "../models/post";

const postController = {};

postController.index = async (req, res) => {
  try {
    const posts = await Post.find().populate("postedBy", "_id name");
    return res.status(200).json(posts);
  } catch (er) {
    res.status(500).json(er);
  }
};

postController.mypost = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    return res.status(200).json(posts);
  } catch (er) {
    res.status(500).json(er);
  }
};

postController.create = async (req, res) => {
  const { title, body, photo } = req.body;

  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });

  try {
    await post.save();
    res.status(200).send(post);
  } catch (e) {
    res.status(422).send(e.message);
  }
};

postController.detail = async (req, res) => {
  const id = req.param.id;

  try {
    const posts = await Post.find({ postedBy: req.user._id, _id: id }).populate(
      "postedBy",
      "_id name"
    );
    return res.status(200).json(posts);
  } catch (er) {
    res.status(500).json(er);
  }
};

postController.update = async (req, res) => {
  const id = req.param.id;

  try {
    const posts = await Post.findAndUpdate(
      { postedBy: req.user._id, _id: id },
      { title, body, photo }
    );
    return res.status(200).json({ success: true });
  } catch (er) {
    res.status(500).json(er);
  }
};

postController.delete = async (req, res) => {
  const id = req.param.id;
  try {
    const posts = await Post.delete({ postedBy: req.user._id, _id: id });
    return res.status(200).json({ success: true });
  } catch (er) {
    res.status(500).json(er);
  }
};

export default postController;
