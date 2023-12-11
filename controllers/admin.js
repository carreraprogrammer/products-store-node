const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();

    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};