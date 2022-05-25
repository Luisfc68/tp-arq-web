const { Meal } = require('../models/meal');
const { User } = require('../models/user');
const { APIError } = require("../utils/APIError");
const { ERROR_MESSAGES } = require("../utils/constants");
const { Types } = require("mongoose");
const { save } = require("../utils/fileUtils");
const { singleImageMulter } = require('../middlewares/multer');

const getUsersMeal = function (userId, mealId) {
    let meal;
    return Meal.findById(mealId)
        .then(mealDocument => {
            if (mealDocument) {
                meal = mealDocument;
                return User.findById(userId);
            }
            throw new APIError(404);
        })
        .then(user => {
            if (!user) {
                throw new APIError(404);
            }
            const isUsersRestaurant = user.restaurants
                .some(restaurant => restaurant.id === meal.restaurant.toString());
            if(isUsersRestaurant) {
                return meal;
            } else {
                throw new APIError(409, ERROR_MESSAGES.RESTAURANT_OWNER);
            }
        });
}

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
                throw new APIError(409, ERROR_MESSAGES.RESTAURANT_OWNER);
            }
            return newMeal.save();
        })
        .then(mealDocument => res.status(201).json(mealDocument))
        .catch(next);

}

const getMeal = function (req, res, next) {
    const id = req.params.mealId;
    if (!Types.ObjectId.isValid(id)) {
        throw new APIError(404);
    }
    Meal.findById(id)
        .then(meal => {
            if (meal) {
                res.json(meal);
            } else {
                new APIError(404);
            }
        })
        .catch(next);
}

const postMealImage = function (req, res, next) {
    const imageMulter = singleImageMulter();
    const mealId = req.params.mealId;
    const userId = req.body.id;
    imageMulter(req, res, (err) => {
        if (err) {
            next(new APIError(400, ERROR_MESSAGES.notFound('Image field')));
            return;
        }
        getUsersMeal(userId, mealId, next)
            .then(() => {
                const imageName = req.file.originalname;
                const imageExtension = imageName.substring(imageName.lastIndexOf('.'));
                return save(`/public/images/meals/${mealId}${imageExtension}`, req.file.buffer);
            })
            .then(() => res.status(204).send())
            .catch(next);
    });
}

module.exports = {
    createMeal,
    getMeal,
    postMealImage
}