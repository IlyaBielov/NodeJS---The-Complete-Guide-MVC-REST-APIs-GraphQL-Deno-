const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
    let quantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex > -1) {
        quantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = quantity;
    } else {
        updatedCartItems.push({ productId: product._id, quantity });
    }

    this.cart = { items: updatedCartItems };
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }
//
//     save() {
//         const db = getDb();
//
//         return db.collection('users').insertOne(this)
//             .then(user => console.log(user))
//             .catch((error) => console.log(error));
//     }
//
//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
//         let quantity = 1;
//         const updatedCartItems = [...this.cart.items];
//
//         if (cartProductIndex > -1) {
//             quantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = quantity;
//         } else {
//             updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity });
//         }
//
//         const updatedCart = { items: updatedCartItems }
//         const db = getDb();
//         return db.collection('users')
//             .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
//             .then(result => console.log(result))
//             .catch((error) => console.log(error));
//     }
//
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(item => item.productId);
//
//         return db.collection('products')
//             .find({_id: { $in: productIds }})
//             .toArray()
//             .then(products => {
//                 return products.map(product => {
//                     const quantity = this.cart.items
//                         .find(item => item.productId.toString() === product._id.toString())
//                         .quantity
//
//                     return { ...product, quantity }
//                 })
//             });
//     }
//
//     addOrder() {
//         const db = getDb();
//        return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.name
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         }).then(() => {
//             this.cart = { items: [] };
//             return db.collection('users')
//                 .updateOne({ _id: this._id }, { $set: { cart: this.cart } })
//         })
//         .catch((error) => console.log(error));
//     }
//
//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray();
//     }
//
//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
//
//         const db = getDb();
//         return db.collection('users')
//             .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCartItems } } })
//             .then(result => console.log(result))
//             .catch((error) => console.log(error));
//     }
//
//     static findByPk(id) {
//         const db = getDb();
//         return db.collection('users').find({ _id: new mongodb.ObjectId(id) }).next()
//             .then(user => user)
//             .catch((error) => console.log(error));
//     }
// }
// module.exports = User;
