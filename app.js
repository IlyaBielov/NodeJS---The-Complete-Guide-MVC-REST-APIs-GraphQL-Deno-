const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');

const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

// Import all database models for our e-commerce application
// These models represent the core entities in our SQL database
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');  // Junction table for Cart-Product many-to-many relationship
const Order = require('./models/order');
const OrderItem = require('./models/order-item'); // Junction table for Order-Product many-to-many relationship

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

// Middleware to attach user to every request
// In a real application, this would be based on authentication/session
// For demo purposes, we always use user with ID 1
app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user; // Attach user object to request for use in controllers
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

// ===== SQL DATABASE RELATIONSHIPS SETUP =====
// This section defines how our database tables are related to each other.
// These relationships are crucial for data integrity and efficient querying.

// 1. USER-PRODUCT RELATIONSHIP (One-to-Many)
// Each product belongs to one user (the seller/admin who created it)
// One user can have many products
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
// Result: Adds 'userId' foreign key to 'products' table
// CASCADE: When user is deleted, all their products are automatically deleted

// 2. USER-CART RELATIONSHIP (One-to-One)
// Each user has exactly one shopping cart
// Each cart belongs to exactly one user
User.hasOne(Cart);
Cart.belongsTo(User);
// Result: Adds 'userId' foreign key to 'carts' table

// 3. CART-PRODUCT RELATIONSHIP (Many-to-Many)
// One cart can contain many products
// One product can be in many different carts (different users' carts)
// We need a junction table (CartItem) to store this relationship + quantity
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// Result: Creates 'cartItems' table with 'cartId', 'productId', and 'quantity' columns
// This allows us to track how many of each product is in each cart

// 4. USER-ORDER RELATIONSHIP (One-to-Many)
// Each order belongs to one user (the customer who placed it)
// One user can have many orders (order history)
Order.belongsTo(User);
User.hasMany(Order);
// Result: Adds 'userId' foreign key to 'orders' table

// 5. ORDER-PRODUCT RELATIONSHIP (Many-to-Many)
// One order can contain many products
// One product can be in many different orders
// We need a junction table (OrderItem) to store this relationship + quantity
Order.belongsToMany(Product, { through: OrderItem });
// Result: Creates 'orderItems' table with 'orderId', 'productId', and 'quantity' columns
// This preserves the exact state of the order (what was bought and how much)

// ===== DATABASE INITIALIZATION =====
// This section initializes the database and creates initial data
sequelize
    // .sync({ force: true }) // Uncomment to recreate all tables (WARNING: deletes all data!)
    .sync() // Creates tables if they don't exist, based on our model definitions and relationships
    .then(() => User.findByPk(1)) // Look for our demo user
    .then((user) => {
        if (!user) {
            // Create a demo user if none exists
            // In a real app, users would register through a signup process
            return User.create({
                name: 'Admin',
                email: 'admin@mail.com'
            })
        }
        return user;
    })
    .then((user) => user.createCart()) // Create a cart for the user (using the User-Cart relationship)
    .then(() => app.listen(3000)) // Start the server after database is ready
    .catch((err) => console.error(err))
