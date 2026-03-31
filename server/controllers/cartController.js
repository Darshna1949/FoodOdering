const Cart = require("../models/Cart");

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const { foodId } = req.body;

    // find cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // create new cart
      cart = new Cart({
        userId,
        items: [{ foodId, quantity: 1 }]
      });
    } else {
      // check if item already exists
      const itemIndex = cart.items.findIndex(
        item => item.foodId.toString() === foodId
      );

      if (itemIndex > -1) {
        // increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // add new item
        cart.items.push({ foodId, quantity: 1 });
      }
    }

    await cart.save();

    res.json({
      message: "Item added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CART
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId })
      .populate("items.foodId");

    if (!cart) {
      return res.json({
        message: "Cart is empty",
        cart: []
      });
    }

    res.json({
      message: "Cart fetched successfully",
      cart
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      item => item.foodId.toString() === foodId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await cart.save();

    res.json({
      message: "Quantity updated",
      cart
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REMOVE ITEM
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      item => item.foodId.toString() !== foodId
    );

    await cart.save();

    res.json({
      message: "Item removed",
      cart
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};