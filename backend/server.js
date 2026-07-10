require("dotenv").config();

const app = require("./src/app");
const connect = require("./src/db/db");

connect();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

module.exports = app;