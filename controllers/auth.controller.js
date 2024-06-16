import Role from "../models/role.js";
import User from "../models/user.js";
import userToken from "../models/userToken.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });
  if (!user) {
    return next(
      CreateError(404, "Nenhum usuário com este email foi encontrado.")
    );
  }
  const payload = {
    email: user.email,
  };
  const expiresIn = 300;
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  const newToken = new userToken({
    userId: user._id,
    token: token,
  });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let mailDetails = {
    from: "igorminranda17@gmail.com",
    to: email,
    subject: "Alterar senha",
    html: `
  <html>
  <head>
    <title>Solicitação de alteração de senha</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px;">
      <h1 style="color: #333333;">Solicitação para alterar senha</h1>
      <p style="color: #666666;">Olá, ${user.userName},</p>
      <p style="color: #666666;">Recebemos uma solicitação para alterar sua senha no BookStore. Para completar este processo, por favor, clique no botão abaixo:</p>
      <a href="${process.env.LIVE_URL}/reset/${token}" style="display: inline-block; background-color: #0066cc; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; text-align: center;">Alterar senha</a>
      <p style="color: #666666;">Pedimos que se atente, pois este código irá expirar em 5 minutos. Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
    </div>
  </body>
  </html>`,
  };

  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      console.error(err);
      return next(CreateError(500, "Erro ao enviar e-mail"));
    }
    await newToken.save();
    return next(CreateSuccess(200, "E-mail enviado com sucesso"));
  });
};

export const resetPassword = async (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return next(CreateError(400, "Token inválido ou expirado"));
    } else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" },
      });
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(newPassword, salt);
      user.password = encryptedPassword;
      try {
        const updatedUser = await user.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true }
        );
        return next(CreateSuccess(200, "Senha alterada com sucesso"));
      } catch (error) {
        return next(CreateError(500, "Erro ao alterar senha"));
      }
    }
  });
};
