const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

// ===== CART MODEL =====
// Represents a user's shopping cart
// Each user has exactly one cart that persists between sessions
// The cart itself only stores basic info - the actual products and quantities
// are stored in the CartItem junction table
//
// Database relationships:
// - Cart belongsTo User (each cart belongs to one user)
// - Cart belongsToMany Product (via CartItem junction table)
//
// Why we need a separate Cart table instead of storing cart items directly on User:
// 1. Better data organization and separation of concerns
// 2. Easier to extend with cart-specific features (creation date, etc.)
// 3. Cleaner relationship structure for many-to-many with products
const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    // Note: userId foreign key is automatically added by Sequelize
    // due to the Cart.belongsTo(User) relationship defined in app.js
})

module.exports = Cart;
