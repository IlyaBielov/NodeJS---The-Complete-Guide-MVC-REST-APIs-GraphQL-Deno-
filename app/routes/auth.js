const express = require('express');

const authController = require("../controllers/auth");
const User = require("../models/user");
const { loginValidators, signupValidators, resetPasswordValidators, newPasswordValidators } = require('../validators');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
    '/login',
    loginValidators,
    authController.postLogin
);

router.get('/signup', authController.getSignup);
router.post(
    '/signup',
    signupValidators,
    authController.postSignup
);

router.get('/reset-password', authController.getResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);
router.post('/reset-password', 
    resetPasswordValidators,
    authController.postResetPassword
);

router.post('/new-password', 
    newPasswordValidators,
    authController.postNewPassword
);

router.post('/logout', authController.postLogout);

module.exports = router;
