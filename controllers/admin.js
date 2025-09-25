const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            const isAuthenticated = req.session.isLoggedIn;
            const pageTitle = 'Admin Products'
            const path = '/admin/products'

            res.render('admin/products', { products, pageTitle, path, isAuthenticated })
        })
        .catch((error) => console.log(error))
}

exports.getAddProduct = (req, res, next) => {
    const isAuthenticated = req.session.isLoggedIn;
    const pageTitle = 'Add Product';
    const path = '/admin/add-product';

    res.render('admin/edit-product', { pageTitle, path, isAuthenticated });
}
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product({ title, price, description, imageUrl, userId: req.user });

    product.save()
        .then(() => res.redirect('/products'))
        .catch((error) => console.error(error));
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const id = req.params.productId;

    Product.findById(id)
        .then((product) => {
            const isAuthenticated = req.session.isLoggedIn;
            const pageTitle = 'Edit Product'
            const path = '/admin/edit-product'
            const editing = editMode

            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { pageTitle, path, editing, product, isAuthenticated })
        })
        .catch((error) => console.log(error));

}
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            product.price = updatedPrice;

            return product.save();
        })
        .then(() => res.redirect('/admin/products'))
        .catch((error) => console.log(error))
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;

    Product.findByIdAndDelete(id)
        .then(() => res.redirect('/admin/products'))
        .catch((error) => console.log(error))
}
