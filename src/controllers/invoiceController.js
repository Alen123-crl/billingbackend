const Invoice = require('../models/invoice');
const Customer = require('../models/customer');



exports.createInvoice = async (req, res) => {
  try {
    const { customer, items} = req.body;

  
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer is required"
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required"
      });
    }

    const customerData = await Customer.findById(customer);
    if (!customerData) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    let subtotal = 0;

    const processedItems = items.map((i) => {
      if (i.quantity <= 0 || i.price < 0) {
        throw new Error("Invalid item data");
      }

      const total = i.quantity * i.price;
      subtotal += total;

      return {
        item: i.item,
        quantity: i.quantity,
        price: i.price,
        total
      };
    });

   
    const discount = customerData.discount || 0;
    const discountAmount = (subtotal * discount) / 100;


    const grandTotal = subtotal - discountAmount;

    
    const invoice = new Invoice({
      customer,
      items: processedItems,
      subtotal,
      discount,
      total: grandTotal
    });

    await invoice.save();

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice
    });

  } catch (err) {
    console.error("Create Invoice Error:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
};




exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer')
      .populate('items.item')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });

  } catch (err) {
    console.error("Get Invoices Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices"
    });
  }
};




exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('items.item');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice
    });

  } catch (err) {
    console.error("Get Invoice Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice"
    });
  }
};




exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully"
    });

  } catch (err) {
    console.error("Delete Invoice Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete invoice"
    });
  }
};