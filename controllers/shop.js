const Product = require('../models/product');

// ===== SHOP CONTROLLER =====
// This controller demonstrates how our SQL relationships work in practice
// It shows the power of Sequelize associations for querying related data

exports.getIndex = (req, res, next) => {
    // Simple query to get all products
    // Uses the Product model we defined with its relationships
    Product.findAll()
        .then((products) => {
            const pageTitle = 'Shop'
            const path = '/'

            res.render('shop/index', { products, pageTitle, path })
        })
        .catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    // ===== DEMONSTRATES: User-Cart-Product Relationships =====
    // This method shows how our SQL relationships work together:
    // 1. User hasOne Cart (req.user.getCart())
    // 2. Cart belongsToMany Product through CartItem (cart.getProducts())
    // 3. Access junction table data (product.cartItem.quantity)

    req.user.getCart() // Uses User-Cart relationship (User hasOne Cart)
        .then((cart) => cart.getProducts() // Uses Cart-Product relationship via CartItem junction table
            .then((products) => {
                // Each product now has a 'cartItem' property containing junction table data
                // This includes the quantity from the CartItem table
                const totalPrice = products
                    .reduce((acc, product) => acc + (product.price * product.cartItem.quantity), 0.0);

                res.render('shop/cart', {
                    pageTitle: 'Your Cart',
                    path: '/cart',
                    products, // Products with cartItem.quantity attached
                    totalPrice
                });
            }))
        .catch((error) => console.log(error))
}
exports.postCart = (req, res, next) => {
    // ===== DEMONSTRATES: Junction Table Operations =====
    // This method shows how to work with many-to-many relationships and junction tables
    // It handles both adding new items and updating existing items in the cart

    const id = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user.getCart() // Get user's cart using User-Cart relationship
        .then((cart) => {
            fetchedCart = cart;
            // Check if product is already in cart by querying the junction table
            // This uses the Cart-Product relationship through CartItem
            return cart.getProducts({ where: { id } })
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0]; // Product already exists in cart
            }

            if (product) {
                // Product exists in cart - update quantity in junction table
                const oldQuantity = product.cartItem.quantity; // Access junction table data
                newQuantity = oldQuantity + 1; // Increment quantity
                return product;
            }

            // Product not in cart - fetch it from database to add it
            return Product.findByPk(id)
        })
        .then((product) => fetchedCart.addProduct(product, {
            // The 'through' option allows us to set data in the junction table (CartItem)
            // This either creates a new CartItem record or updates existing one
            through: { quantity: newQuantity }
        }))
        .then(() => res.redirect('/cart'))
        .catch((error) => console.log(error))
}
exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.productId;

    req.user.getCart()
        .then((cart) => cart.getProducts({ where: { id } }))
        .then((products) => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => res.redirect('/cart'))
        .catch((error) => console.log(error))
}

exports.getOrders = (req, res, next) => {
    // ===== DEMONSTRATES: Eager Loading with Relationships =====
    // This method shows how to efficiently load related data using SQL JOINs
    // The 'include' option tells Sequelize to join the related tables

    req.user.getOrders({ include: ['products'] }) // Uses User-Order relationship + Order-Product relationship
        .then((orders) => {
            // Each order now includes its products with orderItem.quantity data
            // This is possible because of our Order-Product many-to-many relationship
            // Sequelize automatically joins: orders -> orderItems -> products
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders // Orders with products and quantities included
            });
        })
        .catch((error) => console.log(error))
}
exports.postOrder = (req, res, next) => {
    // ===== DEMONSTRATES: Complex Multi-Table Operations =====
    // This method shows the power of our SQL relationship design:
    // 1. Read from Cart-Product junction table (CartItem)
    // 2. Create new Order using User-Order relationship
    // 3. Copy data to Order-Product junction table (OrderItem)
    // 4. Clear the cart (remove CartItem records)

    let fetchedCart;
    req.user.getCart() // Use User-Cart relationship
        .then((cart) => {
            fetchedCart = cart;
            // Get all products in cart with their quantities from CartItem junction table
            return cart.getProducts();
        })
        .then((products) => {
           // Create new order using User-Order relationship (User hasMany Order)
           return req.user.createOrder()
               .then((order) => {
                   // Copy cart items to order items
                   // This transfers data from CartItem junction table to OrderItem junction table
                   return order.addProducts(products.map(product => {
                       // Set the quantity in the OrderItem junction table
                       // by copying it from the CartItem junction table
                       product.orderItem = {
                           quantity: product.cartItem.quantity // Copy quantity from cart to order
                       }

                       return product;
                   }));
               });
        })
        .then(() => fetchedCart.setProducts(null)) // Clear cart by removing all CartItem records
        .then(() => res.redirect('/orders'))
        .catch((error) => console.log(error))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}
