const { validationResult } = require('express-validator');
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.session.user._id })
        .then((products) => {
            const pageTitle = 'Admin Products'
            const path = '/admin/products'

            res.render('admin/products', { products, pageTitle, path })
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getAddProduct = (req, res, next) => {
    const pageTitle = 'Add Product';
    const path = '/admin/add-product';

    res.render('admin/edit-product', { pageTitle, path });
}
exports.postAddProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            errorMessage: errors.array()[0].msg,
            product: {
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                price: req.body.price
            }
        });
    }

    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product({ title, price, description, imageUrl, userId: req.session.user });

    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getEditProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.redirect('/admin/products');
    }

    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const id = req.params.productId;

    Product.findById(id)
        .then((product) => {
            const pageTitle = 'Edit Product'
            const path = '/admin/edit-product'
            const editing = editMode

            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { pageTitle, path, editing, product })
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}
exports.postEditProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            errorMessage: errors.array()[0].msg,
            product: {
                _id: req.body.productId,
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                price: req.body.price
            }
        });
    }

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    Product.findById(prodId)
        .then(product => {
            if (!product || product.userId.toString() !== req.session.user._id.toString()) {
                return res.redirect('/admin/products');
            }

            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            product.price = updatedPrice;

            return product.save()
                .then(() => res.redirect('/admin/products'));
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.redirect('/admin/products');
    }

    const id = req.body.productId;

    Product.findByIdAndDelete({ _id: id, userId: req.session.user._id })
        .then(() => res.redirect('/admin/products'))
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}
