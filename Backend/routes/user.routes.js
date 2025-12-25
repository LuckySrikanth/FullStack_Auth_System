const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../utils/upload");


router.get("/me/profile", authMiddleware, userController.getMyProfile);
router.put(
    "/me/profile",
    authMiddleware,
    upload.single("profileImage"),
    userController.updateMyProfile
);


router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, userController.getUserProfile);
router.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser
);


module.exports = router;
