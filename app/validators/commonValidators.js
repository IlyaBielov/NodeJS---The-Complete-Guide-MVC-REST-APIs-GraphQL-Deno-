const { body, param } = require('express-validator');

// MongoDB ID validation for parameters
const validateMongoIdParam = (paramName) => {
    return param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName}`);
};

// MongoDB ID validation for body fields
const validateMongoIdBody = (fieldName) => {
    return body(fieldName)
        .isMongoId()
        .withMessage(`Invalid ${fieldName}`);
};

// Specific common validators
const validateProductIdParam = () => {
    return validateMongoIdParam('productId');
};

const validateProductIdBody = () => {
    return validateMongoIdBody('productId');
};

const validateUserIdBody = () => {
    return validateMongoIdBody('userId');
};

module.exports = {
    validateMongoIdParam,
    validateMongoIdBody,
    validateProductIdParam,
    validateProductIdBody,
    validateUserIdBody
};
