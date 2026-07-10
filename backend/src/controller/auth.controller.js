const usermodel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function RegisterController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const isUserAlreadyExist = await usermodel.findOne({ username });

    if (isUserAlreadyExist) {
      return res.status(400).json({
        message: "Username is already taken",
      });
    }

    const user = await usermodel.create({
      username,
      password: await bcrypt.hash(password, 10),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        username: user.username,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("RegisterController error:", error);
    return res.status(500).json({ message: "Something went wrong while creating your account" });
  }
}

async function LoginController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await usermodel.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "User not found, please check your username",
      });
    }

    const ispasswordValid = await bcrypt.compare(password, user.password);

    if (!ispasswordValid) {
      return res.status(400).json({
        message: "Incorrect password, please try again",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        username: user.username,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("LoginController error:", error);
    return res.status(500).json({ message: "Something went wrong while logging in" });
  }
}

async function MeController(req, res) {
  return res.status(200).json({
    user: {
      username: req.user.username,
      id: req.user._id,
    },
  });
}

async function LogoutController(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  RegisterController,
  LoginController,
  MeController,
  LogoutController,
};
