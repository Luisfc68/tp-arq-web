const { Router } = require('express');
const mealsController = require('../controllers/meals.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

const router = Router();
const meals = '/meals';
const mealById = meals+'/:mealId';
const mealImage = mealById+'/image';

router.post(meals, authMiddleware(ROLES.RESTAURANT), mealsController.createMeal);
router.get(mealById, authMiddleware(ROLES.CLIENT), mealsController.getMeal);
router.put(mealImage, authMiddleware(ROLES.RESTAURANT), mealsController.postMealImage);
router.get(mealImage, mealsController.getMealImage);

module.exports = router;