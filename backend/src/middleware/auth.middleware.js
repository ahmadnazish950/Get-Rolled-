
const jwt = require("jsonwebtoken");
const usermodel = require("../models/user.model");

async function authmiddleware (req, res , next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access , please login again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await usermodel.findById({
      _id: decoded.id,
    });

    req.user = user;
    next()
    
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized token , please login again" });
  }
}

module.exports = authmiddleware