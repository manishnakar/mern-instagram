"use strict";

import express from "express";
import user_controller from "../controllers/user";
import auth from "../middlewares/auth";

const userRouter = express.Router();

userRouter.get("/", auth, user_controller.index);

userRouter.post("/", user_controller.create);

userRouter.post("/login", user_controller.login);

userRouter.get("/logout", auth, user_controller.logout);

export default userRouter;
