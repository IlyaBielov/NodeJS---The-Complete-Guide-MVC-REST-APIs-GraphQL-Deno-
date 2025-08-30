const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'products.json');

const Cart = require('./cart');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static fetchById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id);
            cb(product);
        })
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                } else {
                    console.log(err)
                }
            });
        });
    }

    save() {
        this.id = Math.random().toString();

        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        })
    }

    update(id) {
        getProductsFromFile((products) => {
            const existingProductIndex = products.findIndex(p => p.id === id);
            if (existingProductIndex >= 0) {
                this.id = id;
                products[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
}
