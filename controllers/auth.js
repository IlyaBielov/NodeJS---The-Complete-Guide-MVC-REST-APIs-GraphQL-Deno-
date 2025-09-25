const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('68d4137e8052126faae8e837')
        .then((user) => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(() => {
                res.redirect('/');
            });
        })
        .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}
