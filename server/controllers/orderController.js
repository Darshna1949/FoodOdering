const Order = require("../models/Order");
const Cart = require("../models/Cart");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    let items = [];
    let totalAmount = 0;

    // Prefer items sent from client (mobile/web) payload
    if (req.body && Array.isArray(req.body.items) && req.body.items.length) {
      items = req.body.items.map((item) => {
        const quantity = item.quantity || 1;
        // totalAmount may be sent from client; if not, we can still accumulate
        if (typeof item.price === "number") {
          totalAmount += item.price * quantity;
        }
        return {
          foodId: item.foodId || item._id,
          quantity
        };
      });

      if (req.body.totalAmount && typeof req.body.totalAmount === "number") {
        totalAmount = req.body.totalAmount;
      }
    } else {
      // Fallback to server-side cart if no items provided
      const cart = await Cart.findOne({ userId }).populate("items.foodId");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      items = cart.items.map((item) => {
        totalAmount += item.foodId.price * item.quantity;
        return {
          foodId: item.foodId._id,
          quantity: item.quantity
        };
      });

      // clear cart
      cart.items = [];
      await cart.save();
    }

    if (!items.length) {
      return res.status(400).json({ message: "No items to place order" });
    }

    const order = new Order({
      userId,
      items,
      totalAmount
    });

    await order.save();

    res.json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER ORDER
exports.getOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await Order.find({ userId })
      .populate("items.foodId");

    res.json({
      message: "Orders fetched successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrder = async (req, res) => {
  try {
    const order = await Order.find()
      .populate("items.foodId")
      .populate("userId", "name email");

    res.json({
      message: "All orders fetched",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};