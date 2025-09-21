const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');

const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const User = require("./models/user");
const mongoConnect = require('./utils/database').mongoConnect;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findByPk('68c944ccd669a3f2763e646e')
        .then((user) => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

mongoConnect(() => {
    app.listen(3000)
})
