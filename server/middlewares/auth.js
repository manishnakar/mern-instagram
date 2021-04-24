import jwt from "jsonwebtoken";
import Users from "../models/user";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ _id: decode._id, token: token });

    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({
      isAuth: false,
      error: true,
      message: err,
    });
  }
};

export default auth;
