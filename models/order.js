const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

// ===== ORDER MODEL =====
// Represents completed purchases in our e-commerce system
// When a user checks out their cart, the cart contents are converted into an order
// Orders preserve the exact state of what was purchased (via OrderItem junction table)
//
// Database relationships:
// - Order belongsTo User (each order belongs to the customer who placed it)
// - Order belongsToMany Product (via OrderItem junction table)
//
// Why we need separate Order and Cart entities:
// 1. Cart is temporary/mutable (items can be added/removed)
// 2. Order is permanent/immutable (historical record of purchase)
// 3. Orders preserve exact quantities and prices at time of purchase
// 4. Users can have multiple orders (purchase history)
// 5. Business analytics and reporting require order data
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    // Note: userId foreign key is automatically added by Sequelize
    // due to the Order.belongsTo(User) relationship defined in app.js
    //
    // In a real application, you might also store:
    // - totalAmount: total price of the order
    // - orderDate: when the order was placed
    // - status: pending, shipped, delivered, etc.
    // - shippingAddress: where to deliver the order
})

module.exports = Order;
