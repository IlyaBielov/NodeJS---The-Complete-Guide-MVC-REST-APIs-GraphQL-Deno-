const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

// ===== USER MODEL =====
// Represents users in our e-commerce system (customers, admins, sellers)
// This is the central entity that connects to products, carts, and orders
// 
// Database relationships:
// - User hasMany Product (products they created/sell)
// - User hasOne Cart (their shopping cart)
// - User hasMany Order (their purchase history)
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
        // In a real app, this should be unique and validated
    }
})

module.exports = User;
