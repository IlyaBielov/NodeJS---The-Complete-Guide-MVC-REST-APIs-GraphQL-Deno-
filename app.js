const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require("./models/user");

const MONGODB_URI = 'mongodb+srv://ilya-node-js_db_user:8NUfILivrAERNbsV@cluster0.0cnarzr.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collections: 'sessions'
});

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Ilya',
                    email: 'ilya@mail.com',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => console.log(err));
