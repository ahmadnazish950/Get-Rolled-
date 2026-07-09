const express = require("express");
const authroutes = require("./routes/auth.routes");
const postroutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

app.use("/api/auth", authroutes);
app.use("/api/post", postroutes);

module.exports = app;
