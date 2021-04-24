"use strict";

import express from "express";
import post_controller from "../controllers/post";
import auth from "../middlewares/auth";

const postRouter = express.Router();

//get all post
postRouter.get("/", auth, post_controller.index);
//get all post by loggedin user
postRouter.get("/mypost", auth, post_controller.mypost);
//create post
postRouter.post("/", auth, post_controller.create);
//get post by id
postRouter.get("/:id", auth, post_controller.detail);
//update post
postRouter.put("/:id", auth, post_controller.update);
//delete post
postRouter.delete("/:id", auth, post_controller.delete);

export default postRouter;
