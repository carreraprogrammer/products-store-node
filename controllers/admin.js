const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
 try {
  const { title, imageUrl, description, price } = req.body;

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result => {
    console.log(result);
    res.redirect('/admin/products');
  })
 
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const product = await Product.findByPk(prodId);

  try {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, imageUrl, description, price } = req.body;

    const product = new Product(productId, title, imageUrl, description, price);

    await product.save();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();

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

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId
  const product = await Product.findByPk(productId);

  try {
    await Product.deleteById(productId);
    console.log('DESTROYED PRODUCT' + productId);
    Cart.deleteById(productId, product.price);
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};