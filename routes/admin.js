const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/products => GET
router.get('/products', adminController.getProducts);

module.exports = router;
