const { Router } = require('express');
const { authMiddleware } = require("../middlewares/authMiddleware");
const ordersController = require('../controllers/orders.controller');
const { ROLES } = require("../utils/constants");

const router = Router();
const orders = '/orders';

router.post(orders, authMiddleware(ROLES.CLIENT), ordersController.createOrder);
router.get(orders, authMiddleware(ROLES.CLIENT), ordersController.getOrders);

module.exports = router;