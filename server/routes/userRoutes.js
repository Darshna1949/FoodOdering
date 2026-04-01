const express = require("express");
const router = express.Router();

const { getUsers, updateUserStatus } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin-only user management routes
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateUserStatus);

module.exports = router;
