const { Router } = require('express');
const restaurantsController = require('../controllers/restaurants.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

const router = Router();
const restaurants = '/restaurants';
const restaurantById = restaurants+'/:restaurantId';

router.post(restaurants, authMiddleware(ROLES.RESTAURANT), restaurantsController.createRestaurant);
router.get(restaurantById, authMiddleware(ROLES.CLIENT), restaurantsController.getRestaurant);
router.get(restaurants, authMiddleware(ROLES.CLIENT), restaurantsController.getRestaurants);
router.put(restaurantById, authMiddleware(ROLES.RESTAURANT), restaurantsController.updateRestaurant);
router.delete(restaurantById, authMiddleware(ROLES.RESTAURANT), restaurantsController.deleteRestaurant)
router.get(restaurantById+'/meals', authMiddleware(ROLES.CLIENT), restaurantsController.getRestaurantMeals);

module.exports = router;