const Food = require("../models/Food");

// ADD FOOD
exports.addFood = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    const food = new Food({
      name,
      description,
      price,
      category,
      image
    });

    await food.save();

    res.status(201).json({
      message: "Food added successfully",
      food
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL FOOD
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find();

    res.json({
      message: "Food list fetched successfully",
      foods
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SEARCH FOOD
exports.searchFood = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    const foods = await Food.find({
      name: { $regex: keyword, $options: "i" }
    });

    res.json({
      message: "Search results",
      foods
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE FOOD
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Food updated successfully",
      food: updatedFood
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE FOOD
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    await Food.findByIdAndDelete(id);

    res.json({
      message: "Food deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};