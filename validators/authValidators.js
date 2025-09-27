const { body } = require('express-validator');
const User = require('../models/user');

// Email validation
const validateEmail = () => {
    return body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail();
};

// Email validation with uniqueness check
const validateEmailUnique = () => {
    return body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail()
        .custom((email, { req }) =>
            User.findOne({ email })
                .then((user) => {
                    if (user) {
                        return Promise.reject('E-mail already exists. Please log in or use a different e-mail.');
                    }
                }));
};

// Password validation (basic)
const validatePassword = () => {
    return body('password')
        .isLength({ min: 1 })
        .withMessage('Password is required')
        .trim();
};

// Password validation (strong)
const validatePasswordStrong = () => {
    return body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .isAlphanumeric()
        .withMessage('Password must contain only letters and numbers')
        .trim();
};

// Password confirmation validation
const validatePasswordConfirmation = () => {
    return body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        });
};

// Name validation
const validateName = () => {
    return body('name')
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must contain only letters and spaces');
};

// User ID validation
const validateUserId = () => {
    return body('userId')
        .isMongoId()
        .withMessage('Invalid user ID');
};

// Password token validation
const validatePasswordToken = () => {
    return body('passwordToken')
        .isLength({ min: 1 })
        .withMessage('Invalid password token')
        .trim();
};

// Combined validators for common use cases
const loginValidators = [
    validateEmail(),
    validatePassword()
];

const signupValidators = [
    validateName(),
    validateEmailUnique(),
    validatePasswordStrong(),
    validatePasswordConfirmation()
];

const resetPasswordValidators = [
    validateEmail()
];

const newPasswordValidators = [
    validatePasswordStrong(),
    validatePasswordConfirmation(),
    validateUserId(),
    validatePasswordToken()
];

module.exports = {
    validateEmail,
    validateEmailUnique,
    validatePassword,
    validatePasswordStrong,
    validatePasswordConfirmation,
    validateName,
    validateUserId,
    validatePasswordToken,
    loginValidators,
    signupValidators,
    resetPasswordValidators,
    newPasswordValidators
};
