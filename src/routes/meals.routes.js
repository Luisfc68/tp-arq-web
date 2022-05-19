const { Router } = require('express');
const mealsController = require('../controllers/meals.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

const router = Router();
const meals = '/meals';

router.post(meals, authMiddleware(ROLES.RESTAURANT), mealsController.createMeal);

module.exports = router;