const { Meal } = require('../models/meal');
const { User } = require('../models/user');
const { APIError } = require("../utils/APIError");
const { ERROR_MESSAGES } = require("../utils/constants");
const { Types } = require("mongoose");

const createMeal = function (req, res, next) {
    const { id, price, name, description } = req.body;
    const restaurantId = req.body.restaurant;

    if (!Types.ObjectId.isValid(restaurantId)) {
        throw new APIError(400, ERROR_MESSAGES.BAD_FORMAT+' (restaurant)');
    }
    const newMeal = new Meal({ name, description, price, restaurant: restaurantId });

    Meal.validate(newMeal)
        .then(() => User.findById(id))
        .then(user => {
            if (!user) {
                throw new APIError(404, ERROR_MESSAGES.notFound('User'));
            }

            const isUsersRestaurant = user.restaurants.some(restaurant => restaurant.id === restaurantId);
            if (!isUsersRestaurant) {
                throw new APIError(409, 'Restaurant does not belong to user');
            }
            return newMeal.save();
        })
        .then(mealDocument => res.status(201).json(mealDocument))
        .catch(next);

}

module.exports = {
    createMeal
}