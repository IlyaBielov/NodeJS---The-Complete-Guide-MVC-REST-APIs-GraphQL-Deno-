const { body, param } = require('express-validator');

// Product title validation
const validateProductTitle = () => {
    return body('title')
        .trim()
        .escape()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-\.,!?()]+$/)
        .withMessage('Title contains invalid characters');
};

// Product image URL validation
const validateProductImageUrl = () => {
    return body('imageUrl')
        .trim()
        .isURL()
        .withMessage('Please enter a valid URL for the image');
};

// Product price validation
const validateProductPrice = () => {
    return body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number')
        .toFloat();
};

// Product description validation
const validateProductDescription = () => {
    return body('description')
        .trim()
        .escape()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters');
};

// Product ID validation (for params)
const validateProductId = () => {
    return param('productId')
        .isMongoId()
        .withMessage('Invalid product ID');
};

// Product ID validation (for body)
const validateProductIdBody = () => {
    return body('productId')
        .isMongoId()
        .withMessage('Invalid product ID');
};

// Combined validators for common use cases
const addProductValidators = [
    validateProductTitle(),
    validateProductImageUrl(),
    validateProductPrice(),
    validateProductDescription()
];

const editProductValidators = [
    validateProductIdBody(),
    validateProductTitle(),
    validateProductImageUrl(),
    validateProductPrice(),
    validateProductDescription()
];

module.exports = {
    validateProductTitle,
    validateProductImageUrl,
    validateProductPrice,
    validateProductDescription,
    validateProductId,
    validateProductIdBody,
    addProductValidators,
    editProductValidators
};
