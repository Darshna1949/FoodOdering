const express = require("express");
const router = express.Router();

const { placeOrder, getOrder, getAllOrder, updateOrderStatus } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/place", authMiddleware, placeOrder);
router.get("/", authMiddleware, getOrder);
//Admin only
router.get("/all", authMiddleware, roleMiddleware("admin"), getAllOrder);
router.put("/status/:id", authMiddleware, roleMiddleware("admin"), updateOrderStatus);
module.exports = router;