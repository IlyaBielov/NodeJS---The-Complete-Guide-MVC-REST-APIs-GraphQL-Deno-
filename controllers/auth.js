const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: req.flash('error')[0],
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                req.flash('error', 'No user with that email');
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password)
                .then((result) => {
                    if (result) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(() => res.redirect('/'));
                    }

                    req.flash('error', 'Invalid email or password');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err)
                    req.flash('error', 'An unexpected error occurred. Please try again.');
                    return res.redirect('/login');
                })
        })
        .catch(err => console.log(err))
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: '/signup',
        errorMessage: req.flash('error')[0],
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/signup');
    }

    User.findOne({ email })
        .then((user) => {
            if (user) {
                req.flash('error', 'E-mail already exists. Please log in or use a different e-mail.');
                return res.redirect('/signup');
            } else {
                return bcrypt.hash(password, 12)
                    .then((hashedPassword) => {
                        const user = new User({
                            email,
                            password: hashedPassword,
                            cart: { items: [] }
                        });

                        return user.save();
                    })
                    .then(() => res.redirect('/login'))
                    .catch(err => {
                        console.log(err);
                        req.flash('error', 'Failed to create account. Please try again later.');
                        return res.redirect('/signup');
                    });
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error', 'An unexpected error occurred. Please try again later.');
            return res.redirect('/signup');
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}
