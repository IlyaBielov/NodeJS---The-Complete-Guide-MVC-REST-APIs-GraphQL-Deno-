const productValidators = require('./productValidators');
const authValidators = require('./authValidators');
const commonValidators = require('./commonValidators');

module.exports = {
    ...productValidators,
    ...authValidators,
    ...commonValidators
};
