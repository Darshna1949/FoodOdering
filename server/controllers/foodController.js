const Food = require("../models/Food");

// ADD FOOD
exports.addFood = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // Default food image from Unsplash when none is provided
    const defaultImage =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

    const food = new Food({
      name,
      description,
      price,
      category,
      image: image || defaultImage
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
    const defaultImage =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

    const foods = await Food.find();

    const foodsWithImages = foods.map(food => {
      // If image missing OR looks like a local file (e.g. "pizza.jpg"),
      // replace it with the default Unsplash image URL so the browser
      // doesn't try to load it from http://127.0.0.1:8080/pizza.jpg.
      if (!food.image || !food.image.startsWith("http")) {
        food.image = defaultImage;
      }
      return food;
    });

    res.json({
      message: "Food list fetched successfully",
      foods: foodsWithImages
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