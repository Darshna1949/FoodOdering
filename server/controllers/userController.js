const User = require("../models/User");

// GET ALL USERS (ADMIN)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role status createdAt updatedAt");

    res.json({
      message: "Users fetched successfully",
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE USER STATUS (ADMIN)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Active", "Inactive"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, select: "name email role status" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User status updated",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
