const Product = require('../models/product');
const Order = require('../models/order');

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
    const id = req.params.productId;

    Product.findById(id)
        .then((product) => {
            const pageTitle = product.title
            const path = '/products'

            res.render('shop/product-detail', { product, pageTitle, path });
        })
        .catch((error) => console.log(error))
}

exports.getCart = (req, res, next) => {
    req.user
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
    const id = req.body.productId;
    Product.findById(id)
        .then((product) => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch(error => console.log(error))
}
exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.productId;

    req.user.removeFromCart(id)
        .then(() => res.redirect('/cart'))
        .catch((error) => console.log(error))
}

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders
            });
        })
}
exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then((user) => {
            const products = user.cart.items.map(item => ({
                product: { ...item.productId._doc },
                quantity: item.quantity,
            }));

            const order = new Order({
                products: products,
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
            });

            return order.save()
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch((error) => console.log(error))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}
