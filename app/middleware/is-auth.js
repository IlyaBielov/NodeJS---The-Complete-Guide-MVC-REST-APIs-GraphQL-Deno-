module.exports = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        req.flash('error', 'Please log in to access this page.');
        return res.redirect('/login');
    }
}
