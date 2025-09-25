const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const User = require("./models/user");

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findById('68d4137e8052126faae8e837')
        .then((user) => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

mongoose.connect('mongodb+srv://ilya-node-js_db_user:8NUfILivrAERNbsV@cluster0.0cnarzr.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
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
