const { validationResult } = require('express-validator');
const Product = require("../models/product");
const fileHelper = require('../utils/fileHelper');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;

    Product.find({ userId: req.session.user._id })
        .countDocuments()
        .then((count) => {
            return Product.find({ userId: req.session.user._id })
                .skip(ITEMS_PER_PAGE * (page - 1))
                .limit(ITEMS_PER_PAGE)
                .then((products) => {
                    const pageTitle = 'Admin Products'
                    const path = '/admin/products'

                    res.status(200).render('admin/products', {
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

exports.getAddProduct = (req, res, next) => {
    const pageTitle = 'Add Product';
    const path = '/admin/add-product';

    res.status(200).render('admin/edit-product', { pageTitle, path });
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
                description: req.body.description,
                price: req.body.price
            }
        });
    }

    const title = req.body.title;
    const image = req.file;

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            errorMessage: 'Attached file is not an image. Please attach an image file.',
            product: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price
            }
        });
    }

    const description = req.body.description;
    const price = req.body.price;
    const imageUrl = image.path.replace('app/', '');

    const product = new Product({ title, price, description, imageUrl, userId: req.session.user });

    product.save()
        .then(() => res.status(201).redirect('/admin/products'))
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
                return res.status(404).redirect('/');
            }
            res.status(200).render('admin/edit-product', { pageTitle, path, editing, product })
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
                description: req.body.description,
                price: req.body.price
            }
        });
    }

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.status(404).redirect('/admin/products');
            }
            if (product.userId.toString() !== req.session.user._id.toString()) {
                return res.status(403).redirect('/admin/products');
            }

            product.title = updatedTitle;

            if (image) {
                product.imageUrl = image.path.replace('app/', '');
            }

            product.description = updatedDescription;
            product.price = updatedPrice;

            return product.save()
                .then(() => res.status(200).redirect('/admin/products'));
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.deleteProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed' });
    }

    const id = req.params.productId;

    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.userId.toString() !== req.session.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }
            
            // Properly handle file deletion and product deletion in sequence
            fileHelper.deleteFile(`app/${product.imageUrl}`);
            return Product.deleteOne({ _id: id, userId: req.session.user._id });
        })
        .then((result) => {
            if (result && result.deletedCount > 0) {
                res.status(200).json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ message: 'Product not found or not deleted' });
            }
        })
        .catch((err) => {
            console.error('Error deleting product:', err);
            res.status(500).json({ message: 'Error deleting product' });
        })
}
