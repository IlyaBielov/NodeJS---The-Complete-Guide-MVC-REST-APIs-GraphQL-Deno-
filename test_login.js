const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

// Import the auth controller
const authController = require('./controllers/auth');

// Create a test app
const app = express();

// Set up middleware similar to the main app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false
}));

// Set up routes
app.get('/login', authController.getLogin);
app.post('/login', authController.postLogin);

// Test the login functionality
console.log('Testing login functionality...');

// Create a simple test
const testLogin = async () => {
    try {
        // Create a mock request and response
        const mockReq = {
            session: {},
            body: {}
        };
        
        const mockRes = {
            redirect: (path) => {
                console.log(`✓ Redirect called with path: ${path}`);
                return mockRes;
            }
        };
        
        const mockNext = () => {};
        
        // Call the postLogin function
        authController.postLogin(mockReq, mockRes, mockNext);
        
        // Check if session was set correctly
        if (mockReq.session.isLoggedIn === true) {
            console.log('✓ Session isLoggedIn set correctly to true');
            console.log('✓ Login functionality test PASSED');
        } else {
            console.log('✗ Session isLoggedIn not set correctly');
            console.log('✗ Login functionality test FAILED');
        }
        
    } catch (error) {
        console.log('✗ Error during login test:', error.message);
        console.log('✗ Login functionality test FAILED');
    }
};

testLogin();
