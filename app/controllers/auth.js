const bcrypt = require('bcryptjs');
const sg = require('@sendgrid/mail');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

sg.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: req.flash('error')[0],
    });
};

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.status(422).redirect('/login');
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                req.flash('error', 'No user with that email');
                return res.status(404).redirect('/login');
            }
            return bcrypt.compare(password, user.password)
                .then((result) => {
                    if (result) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(() => res.status(200).redirect('/'));
                    }

                    req.flash('error', 'Invalid email or password');
                    res.status(401).redirect('/login');
                })
                .catch(() => {
                    req.flash('error', 'An unexpected error occurred. Please try again.');
                    return res.status(500).redirect('/login');
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: '/signup',
        errorMessage: req.flash('error')[0],
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.status(422).redirect('/signup');
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.status(400).redirect('/signup');
    }
    bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                name,
                email,
                password: hashedPassword,
                cart: { items: [] }
            });

            return user.save();
        })
        .then(() => {
            sg.send({
                to: email,
                from: { email: process.env.SENDGRID_FROM_EMAIL, name: process.env.SENDGRID_FROM_NAME } ,
                subject: `Welcome to ${process.env.APP_NAME}`,
                text: `Thank you for signing up to ${process.env.APP_NAME}. You can now log in and start shopping.`,
                html: `<h1>Thank you for signing up to ${process.env.APP_NAME}. You can now log in and start shopping.</h1>`
            })
            .catch(err => {
                console.error('[auth] Failed to send welcome email:', err && err.message ? err.message : err);
            });
            return res.status(201).redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.status(200).redirect('/');
    });
}

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        path: '/reset-password',
        errorMessage: req.flash('error')[0],
        successMessage: req.flash('success')[0]
    });
};

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            req.flash('error', 'An unexpected error occurred. Please try again later.');
            return res.redirect('/reset-password');
        }

        const token = buffer.toString('hex');

        let newPasswordUser;

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash('error', 'No user with that email exists.');
                    return res.redirect('/reset-password');
                }

                newPasswordUser = user

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;

                return user.save()
            })
            .then(() => {
                if (!newPasswordUser) {
                    return;
                }

                req.flash('success', 'If an account with that email exists, a reset link has been sent.');
                res.redirect('/reset-password');

                sg.send({
                    to: req.body.email,
                    from: { email: 'ilyabielov@gmail.com', name: 'Node Shop' } ,
                    subject: 'Password reset',
                    html: `
                        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                        <p><a href="http://localhost:3000/reset-password/${token}">http://localhost:3000/reset-password/${token}</a></p>
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    `
                })
                    .catch(err => {
                        req.flash('error', 'Please provide your email.');
                        res.redirect('/reset-password');
                        console.error('[auth] Failed to send welcome email:', err && err.message ? err.message : err);
                    });
            })
            .catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/reset-password');
            }

            res.render('auth/new-password', {
                pageTitle: 'Set New Password',
                path: '/reset-password',
                errorMessage: req.flash('error')[0],
                successMessage: req.flash('success')[0],
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    if (newPassword !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect(`/reset-password/${passwordToken}`);
    }

    let resetUser;

    User.findOne({ _id: userId, resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/reset-password');
            }
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            if (!resetUser) {
                return;
            }
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(() => {
            req.flash('success', 'Password updated successfully. Please log in.');
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
