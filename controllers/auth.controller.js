import Role from "../models/role.js";
import User from "../models/user.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const role = await Role.find({ role: "User" });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
    roles: role,
  });

  await newUser.save();
  return next(CreateSuccess(201, "User registered successfully"));
};

export const registerAdmin = async (req, res, next) => {
  const role = await Role.find({});
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: true,
    roles: role,
  });

  await newUser.save();
  return next(CreateSuccess(201, "User registered successfully"));
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );

    const { roles } = user;
    if (!user) {
      return next(CreateError(404, "User not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(CreateError(400, "Invalid credentials"));
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        roles: roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        status: 200,
        message: "Login successful",
        data: user,
      });
    //return next(CreateSuccess(200, "Login successful"));
  } catch (error) {
    console.error(error);
  }
};
