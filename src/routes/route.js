const express = require('express');
const router = express.Router();


const itemController = require('../controllers/itemController');
const customerController = require('../controllers/customerController');
const invoiceController= require('../controllers/invoiceController');

router.post('/items', itemController.addItem);
router.get('/items', itemController.getItems);
router.delete('/items/:id', itemController.deleteItem);


router.post('/customers', customerController.addCustomer);
router.get('/customers', customerController.getCustomers);
router.delete('/customers/:id', customerController.deleteCustomer);


router.post('/invoices', invoiceController.createInvoice);
router.get('/invoices', invoiceController.getInvoices);
router.get('/invoices/:id', invoiceController.getInvoiceById);
router.delete('/invoices/:id', invoiceController.deleteInvoice);


module.exports = router;