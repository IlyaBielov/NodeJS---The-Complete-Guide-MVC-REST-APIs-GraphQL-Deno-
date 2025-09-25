const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const Product = require('./models/product');
const shopController = require('./controllers/shop');

// Mock request and response objects
const mockReq = {
    session: {
        user: {
            _id: '68d4137e8052126faae8e837', // This should match the ID used in auth.js
            name: 'Test User',
            email: 'test@example.com'
        },
        isLoggedIn: true
    }
};

const mockRes = {
    render: (template, data) => {
        console.log('✓ Render called successfully for template:', template);
        console.log('✓ Cart products:', data.products);
        console.log('✓ Test passed - no "populate is not a function" error!');
    }
};

const mockNext = () => {};

// Connect to MongoDB (assuming it's running)
mongoose.connect('mongodb://localhost:27017/shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    
    // Test the getCart function
    console.log('Testing getCart function...');
    shopController.getCart(mockReq, mockRes, mockNext);
    
}).catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Note: Make sure MongoDB is running and the database exists');
});
