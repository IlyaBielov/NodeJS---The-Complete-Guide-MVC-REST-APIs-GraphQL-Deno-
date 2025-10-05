const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { addProductValidators, editProductValidators, validateProductId, validateProductIdBody } = require('../validators');

const router = express.Router();

router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', 
    isAuth,
    addProductValidators,
    adminController.postAddProduct
);

router.get('/edit-product/:productId', 
    isAuth, 
    validateProductId(), 
    adminController.getEditProduct
);
router.post('/edit-product', 
    isAuth,
    editProductValidators,
    adminController.postEditProduct
);

router.delete('/product/:productId',
    isAuth,
    validateProductId(),
    adminController.deleteProduct
);

module.exports = router;
