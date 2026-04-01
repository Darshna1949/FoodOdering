const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { register, login, getProfile, updateProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);

module.exports = router;