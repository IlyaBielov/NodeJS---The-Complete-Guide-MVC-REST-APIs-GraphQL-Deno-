exports.get404 = (req, res, next) => {
    res.status(404).render('page-not-found', {
        pageTitle: 'Page Not Found',
        path: ''
    });
}

exports.get500 = (error, req, res, next) => {
    console.error('Server error:', error);
    res.status(error.httpStatusCode || 500).render('500', {
        pageTitle: 'Server Error',
        path: '',
        errorMessage: 'Something went wrong on our end. Please try again later.'
    });
}
