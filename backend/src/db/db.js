const mongoose = require("mongoose");

function ConnectDB() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("connected to db");
    })
    .catch((error) => {
      console.log("Error occur", error);
    });
}

module.exports = ConnectDB;
