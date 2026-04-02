const Customer = require('../models/customer');


exports.addCustomer = async (req, res) => {
  try {
    const { name, phone, discount } = req.body;


    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Customer name is required"
      });
    }

    if (!phone || phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Valid phone number is required"
      });
    }

    if (discount == null || isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100"
      });
    }


    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Customer with this phone already exists"
      });
    }


    const customer = new Customer({
      name: name.trim(),
      phone,
      discount
    });

    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer
    });

  } catch (err) {
    console.error("Add Customer Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};




exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });

  } catch (err) {
    console.error("Get Customers Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers"
    });
  }
};




exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });

  } catch (err) {
    console.error("Delete Customer Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete customer"
    });
  }
};