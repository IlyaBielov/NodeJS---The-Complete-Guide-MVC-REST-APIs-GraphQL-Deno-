const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

// ===== ORDER ITEM MODEL (Junction Table) =====
// This is a junction/bridge table that enables the many-to-many relationship
// between Order and Product entities
//
// Why we need this junction table:
// 1. One order can contain many products
// 2. One product can be in many different orders
// 3. We need to store additional data: quantity of each product in each order
// 4. Preserves the exact state of the purchase (immutable historical record)
//
// Database structure this creates:
// - orderId (foreign key to orders table) - automatically added by Sequelize
// - productId (foreign key to products table) - automatically added by Sequelize
// - quantity (how many of this product were ordered)
//
// Key difference from CartItem:
// - CartItem is mutable (can be updated/deleted as user modifies cart)
// - OrderItem is immutable (permanent record of what was actually purchased)
//
// This enables business queries like:
// - "Show all items in this order"
// - "What products has this customer ordered historically?"
// - "How many times has this product been sold?"
const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
        // How many of this specific product were ordered
        // This value is copied from CartItem when order is created
    }
    // Note: orderId and productId foreign keys are automatically added by Sequelize
    // due to the belongsToMany relationship defined in app.js
    //
    // In a real application, you might also store:
    // - price: the price of the product at time of purchase (for price history)
    // - productTitle: snapshot of product title at time of purchase
})

module.exports = OrderItem;
