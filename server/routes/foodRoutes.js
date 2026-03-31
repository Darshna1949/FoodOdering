const express = require("express");
const router = express.Router();

const { addFood, getFoods, searchFood, updateFood, deleteFood } = require("../controllers/foodController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Protected route
router.post("/add", authMiddleware, roleMiddleware("admin"), addFood);
router.put("/update/:id", authMiddleware, roleMiddleware("admin"), updateFood);
router.delete("/delete/:id", authMiddleware, roleMiddleware("admin"), deleteFood);

// Public route (no auth needed)
router.get("/", getFoods);
router.get("/search", searchFood);
module.exports = router;