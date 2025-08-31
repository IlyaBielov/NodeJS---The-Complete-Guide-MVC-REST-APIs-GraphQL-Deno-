const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '7415963', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize;
