const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  profileImage: DataTypes.STRING,
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  googleId: DataTypes.STRING,
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }

});

module.exports = User;
