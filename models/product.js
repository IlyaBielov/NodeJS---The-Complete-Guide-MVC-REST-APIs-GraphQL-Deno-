const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

// ===== PRODUCT MODEL =====
// Represents items for sale in our e-commerce system
// Products are created by users and can be added to carts and orders
//
// Database relationships:
// - Product belongsTo User (who created/owns this product)
// - Product belongsToMany Cart (can be in multiple users' carts via CartItem)
// - Product belongsToMany Order (can be in multiple orders via OrderItem)
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
        // Stored as decimal for precise currency calculations
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
        // URL or path to product image
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
        // Product details and features
    }
    // Note: userId foreign key is automatically added by Sequelize
    // due to the Product.belongsTo(User) relationship defined in app.js
});

module.exports = Product;
