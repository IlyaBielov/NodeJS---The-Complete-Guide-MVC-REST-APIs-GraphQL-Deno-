const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => res.render('shop/index', {
        products: products,
        pageTitle: 'Shop',
        path: '/'
    }));
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => res.render('shop/product-list', {
        products: products,
        pageTitle: 'All Products',
        path: '/products'
    }));
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;

    Product.fetchById(id, (product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product ? product.title : 'Product Details',
            path: '/products'
        });
    });
}

exports.getCard = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts,
                totalPrice: cart.totalPrice
            });
        });
    });
}

exports.postCard = (req, res, next) => {
    const id = req.body.productId;
    Product.fetchById(id, (product) => {
        Cart.addProduct(id, product.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.fetchById(id, product => {
        Cart.deleteProduct(id, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}
