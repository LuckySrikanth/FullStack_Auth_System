const { Op } = require("sequelize");
const User = require("../models/user.model");
const redis = require("../config/redis");

exports.getUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const cacheKey = `users:search:${search}`;

   
    const cachedUsers = await redis.get(cacheKey);
    if (cachedUsers) {
      return res.json(JSON.parse(cachedUsers));
    }

  
    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "profileImage"],
    });

    await redis.set(cacheKey, JSON.stringify(users), { EX: 300 });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const cacheKey = `user:${req.params.id}`;

    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }

    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "profileImage"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `user:${userId}`;

    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "profileImage"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const profileImage = req.file ? req.file.filename : undefined;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;

    await user.save();


    await redis.del(`user:${req.user.userId}`);

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    
    await redis.del(`user:${id}`);
    await redis.del(`refresh:${id}`);

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
