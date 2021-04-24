"use strict";
import User from "../models/user";
import { compare } from "bcryptjs";

const userController = {};

userController.index = async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findOne({ email: req.user.email });
    return res.status(200).json({
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      token: req.token,
    });
  } catch (er) {
    res.status(500).json(er);
  }
};

userController.create = async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({
    email,
    password,
    name,
  });

  try {
    const token = await user.generateAuthToken();
    const body = { user: user.toJSON(), token };
    res.status(200).send(body);
  } catch (e) {
    res.status(422).send(e.message);
  }
};

userController.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Invalid input" });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).json({
        loginSuccess: false,
        message: "Invalid Username or password.",
      });
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(422).json({
        loginSuccess: false,
        message: "Invalid Username or password.",
      });
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
      loginSuccess: true,
      token,
    });
  } catch (er) {
    console.log(er);
    return res.status(422).send(er);
  }
};

userController.logout = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { token: req.user.token },
      { token: "", tokenExpiration: "" }
    );
    res.status(200).send({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export default userController;
