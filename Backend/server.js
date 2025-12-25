require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");

(async () => {
  try {
    await sequelize.sync();
    console.log("DB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on ${process.env.PORT}`)
    );
  } catch (err) {
    console.error(err);
  }
})();
