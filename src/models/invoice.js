const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  date: {
    type: Date,
    default: Date.now
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  subtotal: Number,
  discount: Number,
  total: Number
});

module.exports = mongoose.model('Invoice', invoiceSchema);