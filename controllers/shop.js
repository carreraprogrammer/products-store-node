const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    console.log(products)
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  
  try {
    const product = await Product.findByPk(prodId);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {

  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  try {
    const cart = await req.user.getCart();
    fetchedCart = cart;

    const products = await cart.getProducts({ where: { id: prodId } });
    let product;

    if (products.length > 0) {
      product = products[0];
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      product = await Product.findByPk(prodId);
    }

    await fetchedCart.addProduct(product, {
      through: { quantity: newQuantity }
    });

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const cart = await req.user.getCart();

    const products = await cart.getProducts({ where: { id: prodId } });

    if (!products || products.length === 0) {
      // Handle the case where the product is not found
      console.log('Product not found');
      res.redirect('/cart');
      return;
    }

    const product = products[0];

    await product.cartItem.destroy();
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    const order = await req.user.createOrder();
    await order.addProducts(
      products.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    await cart.setProducts(null);

    res.redirect('/orders');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ['products'] });

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
