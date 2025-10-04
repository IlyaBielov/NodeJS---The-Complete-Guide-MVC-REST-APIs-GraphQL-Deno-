const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { sanitizeRequest, securityHeaders } = require('./middleware/sanitize');

const errorController = require('./controllers/error');

const MONGODB_URI = 'mongodb+srv://ilya-node-js_db_user:8NUfILivrAERNbsV@cluster0.0cnarzr.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collections: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './app/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.set('view engine', 'pug');
app.set('views', './app/views');

// Apply security headers first
app.use(securityHeaders);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// Apply sanitization after body parsing but before other middleware
app.use(sanitizeRequest);

app.use(express.static(path.join(rootDir, 'public')));
app.use('/images', express.static(path.join(rootDir, 'images')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Error handling middleware (must be last)
app.use(errorController.get500);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => console.log('Server is running on port 3000'));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        console.error('Application will exit. Please check your database connection.');
        process.exit(1);
    });
