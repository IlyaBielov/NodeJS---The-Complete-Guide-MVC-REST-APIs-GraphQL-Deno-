const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: 'Name must contain only letters and spaces'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product ID is required'],
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required'],
                min: [1, 'Quantity must be at least 1'],
                max: [100, 'Quantity cannot exceed 100 items']
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
    let quantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex > -1) {
        quantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = quantity;
    } else {
        updatedCartItems.push({ productId: product._id, quantity });
    }

    this.cart = { items: updatedCartItems };
    return this.save({ validateModifiedOnly: true });
}

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    return this.save({ validateModifiedOnly: true });
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save({ validateModifiedOnly: true });
}

module.exports = mongoose.model('User', userSchema);
