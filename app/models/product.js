const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0.01, 'Price must be greater than 0']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: {
        type: String,
        required: [true, 'Product image URL is required'],
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    }
});

module.exports = mongoose.model('Product', productSchema);
