const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('Product', productSchema);

// class Product {
//     constructor(title, imageUrl, description, price, id, userId) {
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//         if (id) this._id = new mongodb.ObjectId(id);
//         this.userId = userId;
//     }
//
//     save() {
//         const db = getDb();
//         let dbOp = null;
//
//         console.log(this._id)
//
//         if (this._id) {
//             dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this })
//         } else {
//             dbOp = db.collection('products').insertOne(this)
//         }
//
//         return dbOp.then(result => console.log(result))
//             .catch((error) => console.log(error));
//     }
//
//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()
//             .then(products => products)
//             .catch((error) => console.log(error));
//     }
//
//     static findByPk(id) {
//         const db = getDb();
//         return db.collection('products').find({ _id: new mongodb.ObjectId(id) }).next()
//             .then(product => product)
//             .catch((error) => console.log(error));
//     }
//
//     static deleteByPk(id) {
//         const db = getDb();
//         return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) })
//             .then(result => console.log(result))
//             .catch((error) => console.log(error));
//     }
// }
//
// module.exports = Product;
