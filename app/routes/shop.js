const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
const { validateProductIdParam, validateProductIdBody } = require('../validators');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', 
    validateProductIdParam(), 
    shopController.getProduct
);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', 
    isAuth, 
    validateProductIdBody(), 
    shopController.postCart
);
router.post('/cart-delete-item', 
    isAuth, 
    validateProductIdBody(), 
    shopController.postCartDeleteProduct
);

router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);
router.get('/checkout/cancel', isAuth, shopController.getCheckoutCancel);

module.exports = router;
