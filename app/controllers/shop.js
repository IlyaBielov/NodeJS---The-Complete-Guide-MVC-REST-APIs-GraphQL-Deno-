const { validationResult } = require('express-validator');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const path = require("node:path");
const pdfMaker = require('../utils/pdfMaker');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;

    Product.find()
        .countDocuments()
        .then((count) => {
            return Product.find()
                .skip(ITEMS_PER_PAGE * (page - 1))
                .limit(ITEMS_PER_PAGE)
                .then((products) => {
                    res.status(200).render('shop/index', {
                        products: products,
                        pageTitle: 'Shop',
                        path: '/',
                        currentPage: page,
                        totalProducts: count,
                        hasNextPage: ITEMS_PER_PAGE * page < count,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(count / ITEMS_PER_PAGE)
                    })
                })
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;

    Product.find()
        .countDocuments()
        .then((count) => {
            return Product.find()
                .skip(ITEMS_PER_PAGE * (page - 1))
                .limit(ITEMS_PER_PAGE)
                .then((products) => {
                    const pageTitle = 'All Products'
                    const path = '/products'

                    res.status(200).render('shop/product-list', {
                        products,
                        pageTitle,
                        path,
                        currentPage: page,
                        totalProducts: count,
                        hasNextPage: ITEMS_PER_PAGE * page < count,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(count / ITEMS_PER_PAGE)
                    })
                })
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
    const page = +req.query.page || 1;

    Order.find({ "user.userId": req.session.user._id })
        .countDocuments()
        .then((count) => {
            return Order.find({ "user.userId": req.session.user._id })
                .skip(ITEMS_PER_PAGE * (page - 1))
                .limit(ITEMS_PER_PAGE)
                .then((orders) => {
                    res.render('shop/orders', {
                        pageTitle: 'Your Orders',
                        path: '/orders',
                        orders,
                        currentPage: page,
                        totalProducts: count,
                        hasNextPage: ITEMS_PER_PAGE * page < count,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(count / ITEMS_PER_PAGE)
                    });
                })
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
                    userId: req.session.user._id,
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
    let totalAmount = 0;
    let products = [];

    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then((user) => {
            if (!user) {
                req.flash('error', 'User not found');
                return res.status(404).redirect('/cart');
            }

            products = user.cart.items;

            // Check if cart is empty
            if (products.length === 0) {
                req.flash('error', 'Your cart is empty. Add items to proceed with checkout.');
                return res.redirect('/cart');
            }

            // Calculate total amount
            products.forEach(item => {
                totalAmount += item.quantity * item.productId.price;
            });

            return stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: products.map(item => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.productId.title,
                            description: item.productId.description,
                        },
                        unit_amount: item.productId.price * 100,
                    },
                    quantity: item.quantity,
                })),
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
            });
        })
        .then((session) => {
            res.render('shop/checkout', {
                pageTitle: 'Checkout',
                path: '/checkout',
                products: products,
                totalAmount: totalAmount.toFixed(2),
                sessionId: session.id,
                stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getCheckoutSuccess = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then((user) => {
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/cart');
            }
            
            // Only create order if cart has items
            if (user.cart.items.length === 0) {
                // Cart is already empty, just show success page
                return res.render('shop/checkout-success', {
                    pageTitle: 'Payment Successful',
                    path: '/checkout/success'
                });
            }
            
            const products = user.cart.items.map(item => ({
                product: { ...item.productId._doc },
                quantity: item.quantity,
            }));

            const order = new Order({
                products: products,
                user: {
                    userId: req.session.user._id,
                    email: req.session.user.email,
                },
            });

            return order.save()
                .then(() => user.clearCart())
                .then(() => {
                    req.flash('success', 'Order placed successfully');
                    res.render('shop/checkout-success', {
                        pageTitle: 'Payment Successful',
                        path: '/checkout/success'
                    });
                });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCheckoutCancel = (req, res, next) => {
    res.render('shop/checkout-cancel', {
        pageTitle: 'Payment Cancelled',
        path: '/checkout/cancel'
    });
}
