const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            const pageTitle = 'Shop'
            const path = '/'
            const isAuthenticated = req.session.isLoggedIn;

            res.render('shop/index', { products, pageTitle, path, isAuthenticated })
        })
        .catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            const pageTitle = 'All Products'
            const path = '/products'
            const isAuthenticated = req.session.isLoggedIn;

            res.render('shop/product-list', { products, pageTitle, path, isAuthenticated })
        })
        .catch((error) => console.log(error))
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .then((product) => {
            const pageTitle = product.title
            const path = '/products'
            const isAuthenticated = req.session.isLoggedIn;

            res.render('shop/product-detail', { product, pageTitle, path, isAuthenticated });
        })
        .catch((error) => console.log(error))
}

exports.getCart = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then((user) => {
            const products = user.cart.items;
            const isAuthenticated = req.session.isLoggedIn;

            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products,
                isAuthenticated
            });
        })
        .catch((error) => console.log(error))
}
exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id)
        .then((product) => {
            return User.findById(req.session.user._id)
                .then((user) => user.addToCart(product));
        })
        .then(() => res.redirect('/cart'))
        .catch(error => console.log(error))
}
exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.productId;

    User.findById(req.session.user._id)
        .then((user) => user.removeFromCart(id))
        .then(() => res.redirect('/cart'))
        .catch((error) => console.log(error))
}

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.session.user._id })
        .then((orders) => {
            const isAuthenticated = req.session.isLoggedIn;

            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders,
                isAuthenticated
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
                    name: req.session.user.name,
                    userId: req.session.user,
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
    const isAuthenticated = req.session.isLoggedIn;

    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        isAuthenticated
    })
}
