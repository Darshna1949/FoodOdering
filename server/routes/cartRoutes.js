const express = require("express");
const router = express.Router();

const { addToCart, getCart, updateQuantity, removeItem } = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/update", authMiddleware, updateQuantity);
router.delete("/remove", authMiddleware, removeItem);

module.exports = router;