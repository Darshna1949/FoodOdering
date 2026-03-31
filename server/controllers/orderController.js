const Order = require("../models/Order");
const Cart = require("../models/Cart");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // get cart
    const cart = await Cart.findOne({ userId }).populate("items.foodId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // calculate total
    let totalAmount = 0;

    const items = cart.items.map(item => {
      totalAmount += item.foodId.price * item.quantity;

      return {
        foodId: item.foodId._id,
        quantity: item.quantity
      };
    });

    // create order
    const order = new Order({
      userId,
      items,
      totalAmount
    });

    await order.save();

    // clear cart
    cart.items = [];
    await cart.save();

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