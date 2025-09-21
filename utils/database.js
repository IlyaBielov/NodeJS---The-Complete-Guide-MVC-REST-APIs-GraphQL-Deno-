const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = 'mongodb+srv://ilya-node-js_db_user:8NUfILivrAERNbsV@cluster0.0cnarzr.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'

let _db = null;

const mongoConnect = (callback) => {
    MongoClient
        .connect(url)
        .then(client => {
            console.log('Connected to MongoDB');
            _db = client.db()
            callback();
        })
        .catch((err) => console.log(err));
}

const getDb = () => {
    if (!_db) {
        throw new Error('Database not connected');
    }
    return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
