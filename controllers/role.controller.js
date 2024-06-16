import Role from "../models/role.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({});

    return next(CreateSuccess(20, roles));
  } catch (error) {
    return next(CreateError(500, "Internal server error"));
  }
};

export const createRole = async (req, res, next) => {
  try {
    if (req.body.role && req.body.role !== "") {
      const newRole = new Role(req.body);
      await newRole.save();

      return next(CreateSuccess(201, "Role created successfully"));
    } else {
      return next(
        CreateError(400, "An error occurred while creating the role")
      );
    }
  } catch (error) {
    return next(CreateError(500, "Internal server error"));
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById({ _id: req.params.id });
    if (role) {
      const newData = await Role.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      return next(CreateSuccess(200, "Role updated!", newData));
    } else {
      return next(CreateError(404, "Role not found"));
    }
  } catch (error) {
    return next(CreateError(500, "Internal server error"));
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById({ _id: req.params.id });
    if (role) {
      await Role.findByIdAndDelete(req.params.id);

      return next(CreateSuccess(204, "Role deleted!"));
    } else {
      return next(CreateError(404, "Role not found"));
    }
  } catch (error) {
    return next(CreateError(500, "Internal server error"));
  }
};
