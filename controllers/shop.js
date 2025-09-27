const { validationResult } = require('express-validator');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            const pageTitle = 'Shop'
            const path = '/'

            res.render('shop/index', { products, pageTitle, path })
        })
        .catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            const pageTitle = 'All Products'
            const path = '/products'

            res.render('shop/product-list', { products, pageTitle, path })
        })
        .catch((error) => console.log(error))
}

exports.getProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.redirect('/products');
    }

    const id = req.params.productId;

    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.redirect('/products');
            }
            const pageTitle = product.title
            const path = '/products'

            res.render('shop/product-detail', { product, pageTitle, path });
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/products');
        })
}

exports.getCart = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then((user) => {
            const products = user.cart.items;

            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products,
            });
        })
        .catch((error) => console.log(error))
}
exports.postCart = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.redirect('/cart');
    }

    const id = req.body.productId;
    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.redirect('/cart');
            }
            return User.findById(req.session.user._id)
                .then((user) => user.addToCart(product));
        })
        .then(() => res.redirect('/cart'))
        .catch(error => {
            console.log(error);
            res.redirect('/cart');
        })
}
exports.postCartDeleteProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.redirect('/cart');
    }

    const id = req.body.productId;

    User.findById(req.session.user._id)
        .then((user) => user.removeFromCart(id))
        .then(() => res.redirect('/cart'))
        .catch((error) => {
            console.log(error);
            res.redirect('/cart');
        })
}

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.session.user._id })
        .then((orders) => {

            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders,
            });
        })
}
exports.postOrder = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then((user) => {
            const products = user.cart.items.map(item => ({
                product: { ...item.productId._doc },
                quantity: item.quantity,
            }));

            const order = new Order({
                products: products,
                user: {
                    userId: req.session.user,
                    email: req.session.user.email,
                },
            });

            return order.save()
        })
        .then(() => {
            return User.findById(req.session.user._id);
        })
        .then((user) => user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch((error) => console.log(error))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    })
}
