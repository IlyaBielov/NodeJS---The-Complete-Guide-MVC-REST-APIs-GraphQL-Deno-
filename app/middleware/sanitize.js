const { body, query, param } = require('express-validator');

/**
 * Middleware for sanitizing common input data across the application
 * Provides consistent sanitization patterns for different data types
 */

// Basic sanitization for text inputs
const sanitizeText = (field) => [
    body(field).trim().escape(),
    query(field).optional().trim().escape(),
    param(field).optional().trim().escape()
];

// Email sanitization
const sanitizeEmail = (field) => [
    body(field).trim().normalizeEmail().escape(),
    query(field).optional().trim().normalizeEmail().escape()
];

// URL sanitization
const sanitizeURL = (field) => [
    body(field).trim(),
    query(field).optional().trim()
];

// Number sanitization
const sanitizeNumber = (field) => [
    body(field).trim().toFloat(),
    query(field).optional().trim().toFloat()
];

// MongoDB ObjectId sanitization
const sanitizeObjectId = (field) => [
    body(field).trim(),
    query(field).optional().trim(),
    param(field).optional().trim()
];

// Password sanitization (no escape to preserve special characters)
const sanitizePassword = (field) => [
    body(field).trim()
];

// General request sanitization middleware
const sanitizeRequest = (req, res, next) => {
    // Remove any potentially dangerous characters from request body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                // Remove null bytes and other control characters
                req.body[key] = req.body[key].replace(/\0/g, '');
                // Limit string length to prevent DoS attacks
                if (req.body[key].length > 10000) {
                    req.body[key] = req.body[key].substring(0, 10000);
                }
            }
        });
    }

    // Same for query parameters
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].replace(/\0/g, '');
                if (req.query[key].length > 1000) {
                    req.query[key] = req.query[key].substring(0, 1000);
                }
            }
        });
    }

    // Same for parameters
    if (req.params) {
        Object.keys(req.params).forEach(key => {
            if (typeof req.params[key] === 'string') {
                req.params[key] = req.params[key].replace(/\0/g, '');
                if (req.params[key].length > 100) {
                    req.params[key] = req.params[key].substring(0, 100);
                }
            }
        });
    }

    next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Prevent XSS attacks
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent information disclosure
    res.removeHeader('X-Powered-By');
    
    next();
};

module.exports = {
    sanitizeText,
    sanitizeEmail,
    sanitizeURL,
    sanitizeNumber,
    sanitizeObjectId,
    sanitizePassword,
    sanitizeRequest,
    securityHeaders
};
