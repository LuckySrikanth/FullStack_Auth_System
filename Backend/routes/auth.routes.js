const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const upload = require("../utils/upload");

const {
    registerValidation,
    loginValidation
} = require("../middlewares/auth.validation");

const { validate } = require("../middlewares/validate.middleware");

router.post(
  "/register",
  upload.single("profileImage"),
  registerValidation,
  validate,
  authController.register
);


router.post(
    "/login",
    loginValidation,
    validate,
    authController.login
);

router.get("/verify-email", authController.verifyEmail);
router.post("/refresh-token", authController.refreshToken);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);



module.exports = router;
