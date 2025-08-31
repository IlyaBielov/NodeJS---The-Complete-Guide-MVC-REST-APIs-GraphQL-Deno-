const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

// ===== CART ITEM MODEL (Junction Table) =====
// This is a junction/bridge table that enables the many-to-many relationship
// between Cart and Product entities
//
// Why we need this junction table:
// 1. One cart can contain many products
// 2. One product can be in many different carts (different users)
// 3. We need to store additional data: quantity of each product in each cart
// 4. Without this table, we couldn't efficiently query or manage cart contents
//
// Database structure this creates:
// - cartId (foreign key to carts table) - automatically added by Sequelize
// - productId (foreign key to products table) - automatically added by Sequelize  
// - quantity (how many of this product are in this cart)
//
// SQL queries this enables:
// - "Get all products in user's cart with quantities"
// - "Add product to cart or update quantity if already exists"
// - "Remove specific product from cart"
const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
        // How many of this specific product are in the cart
    }
    // Note: cartId and productId foreign keys are automatically added by Sequelize
    // due to the belongsToMany relationships defined in app.js
})

module.exports = CartItem;
