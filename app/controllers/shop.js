const { validationResult } = require('express-validator');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const path = require("node:path");
const pdfMaker = require('../utils/pdfMaker');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            const pageTitle = 'Shop'
            const path = '/'

            res.status(200).render('shop/index', { products, pageTitle, path })
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            const pageTitle = 'All Products'
            const path = '/products'

            res.status(200).render('shop/product-list', { products, pageTitle, path })
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
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
                return res.status(404).redirect('/products');
            }
            const pageTitle = product.title
            const path = '/products'

            res.status(200).render('shop/product-detail', { product, pageTitle, path });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getCart = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then((user) => {
            if (!user) {
                req.flash('error', 'User not found');
                return res.status(404).redirect('/products');
            }

            const products = user.cart.items;

            res.status(200).render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
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
                req.flash('error', 'Product not found');
                return res.redirect('/cart');
            }
            return User.findById(req.session.user._id)
                .then((user) => {
                    if (!user) {
                        req.flash('error', 'User not found');
                        return res.redirect('/cart');
                    }

                    user.addToCart(product)
                });
        })
        .then(() => res.redirect('/cart'))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}
exports.postCartDeleteProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.redirect('/cart');
    }

    const id = req.body.productId;

    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/cart');
            }
            user.removeFromCart(id)
        })
        .then(() => res.redirect('/cart'))
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}
exports.postOrder = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then((user) => {
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/cart');
            }
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
        .then(() => User.findById(req.session.user._id))
        .then((user) => {
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/cart');
            }
            return user.clearCart()
                .then(() => {
                    req.flash('success', 'Order placed successfully');
                    res.redirect('/orders')
                })
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                req.flash('error', 'Order not found');
                return res.redirect('/orders');
            }

            if (order.user.userId.toString() !== req.session.user._id.toString()) {
                req.flash('error', 'Unauthorized access');
                return res.redirect('/orders');
            }

            const invoiceName = pdfMaker.getInvoiceFilename(orderId);
            const invoicesDir = path.join(__dirname, '..', 'data', 'invoices');

            // Create the PDF using the utility
            const pdfDoc = pdfMaker.createInvoicePDF(order, orderId, invoicesDir);

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);

            // Stream the PDF to the response
            pdfDoc.pipe(res);
            pdfDoc.end();

        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(err);
        })

}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    })
}
