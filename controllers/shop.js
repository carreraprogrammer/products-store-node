const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();

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
  const product = await Product.findById(prodId);
  console.log(product);
  res.render('shop/product-detail', 
  { product: product,
    pageTitle: product.title,
    path: '/products'});
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();

    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  };
};

exports.getCart = async (req, res, next) => {
  try {
    Cart.getCart(async (cart) => {
      if (!cart) {
        // Handle the case where the cart is not available
        console.log('Cart not available');
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: []
        });
        return;
      }

      const products = await Product.fetchAll();

      const cartProducts = products
        .filter((product) =>
          cart.products.some((cartProduct) => cartProduct.id === product.id)
        )
        .map((product) => ({
          productData: product,
          qty: cart.products.find(
            (cartProduct) => cartProduct.id === product.id
          ).qty
        }));

      console.log('******** CART PRODUCTS ********');
      console.log(cartProducts);
      console.log('******** CART PRODUCTS ********');

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    Cart.addProduct(prodId, product.price);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      // Handle the case where the product is not found
      console.log('Product not found');
      res.redirect('/cart');
      return;
    }

    Cart.deleteById(prodId, product.price);
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
