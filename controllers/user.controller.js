import User from "../models/user.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return next(CreateSuccess(200, users));
  } catch (error) {
    return next(CreateError(500, "Internal server error"));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return next(CreateSuccess(200, user));
    } else {
      return next(CreateError(404, "User not found"));
    }
  } catch (error) {
    return next(CreateError(500, "Internal server error"));
  }
};
