const Product = require('../models/product');
const {logger} = require("sequelize/lib/utils/logger");

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            const pageTitle = 'Shop'
            const path = '/'

            res.render('shop/index', { products, pageTitle, path })
        })
        .catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            const pageTitle = 'All Products'
            const path = '/products'

            res.render('shop/product-list', { products, pageTitle, path })
        })
        .catch((error) => console.log(error))
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;

    Product.findByPk(id)
        .then((product) => {
            const pageTitle = product.title
            const path = '/products'

            res.render('shop/product-detail', { product, pageTitle, path });
        })
        .catch((error) => console.log(error))
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then((products) => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products,
            });
        })
        .catch((error) => console.log(error))
}
exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    Product.findByPk(id)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then(() => res.redirect('/cart'))
        .catch(error => console.log(error))
}
exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.productId;

    req.user.deleteItemFromCart(id)
        .then(() => res.redirect('/cart'))
        .catch((error) => console.log(error))
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then((orders) => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders
            });
        })
        .catch((error) => console.log(error))
}
exports.postOrder = (req, res, next) => {
    req.user.addOrder()
        .then(() => res.redirect('/orders'))
        .catch((error) => console.log(error))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}
