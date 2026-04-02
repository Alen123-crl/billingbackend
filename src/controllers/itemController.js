const Item = require('../models/item')



exports.addItem = async (req, res) => {
  try {
    const { name, price } = req.body;


    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Item name is required and must be a string"
      });
    }

    if (price == null || isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number"
      });
    }

  
    const existingItem = await Item.findOne({ name: name.trim() });
    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "Item already exists"
      });
    }

  
    const item = new Item({
      name: name.trim(),
      price
    });

    await item.save();

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item
    });

  } catch (err) {
    console.error("Add Item Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};




exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (err) {
    console.error("Get Items Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch items"
    });
  }
};




exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required"
      });
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully"
    });

  } catch (err) {
    console.error("Delete Item Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete item"
    });
  }
};