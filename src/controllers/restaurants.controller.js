const { Restaurant } = require('../models/restaurant');
const { User } = require("../models/user");
const { APIError } = require("../utils/APIError");
const { Types } = require("mongoose");
const { ROLES } = require("../utils/constants");
const { Meal } = require('../models/meal');
const { optionalPagination } = require("../utils/paginationUtils");

const createRestaurant = function (req, res, next) {
    const { id, rating, name, address } = req.body;

    const newRestaurant = new Restaurant({ rating, name, address });

    Restaurant.validate(newRestaurant)
        .then(() => User.findById(id))
        .then( owner => {
            if (!owner) {
                throw new APIError(404, "Can't find restaurant's owner");
            }
            owner.restaurants.push(newRestaurant);
            return owner.save();
        })
        .then(() => res.status(201).json(newRestaurant))
        .catch(next);

}

const getRestaurant = function (req, res, next) {
    const id = req.params.restaurantId;
    if (!Types.ObjectId.isValid(id)) {
        throw new APIError(404);
    }
    User.findOne({ 'restaurants._id': id },
            {
                restaurants: { '$elemMatch': { _id: id } }
            }
        )
        .transform(user => user?.restaurants[0])
        .then(restaurant => {
            if (restaurant) {
                res.json(restaurant);
            } else {
                throw new APIError(404);
            }
        })
        .catch(next);
}

const getRestaurants = function (req, res, next) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const restaurants = 'restaurants';
    let aggregation = User.aggregate()
        .match({ role: ROLES.RESTAURANT })
        .project(restaurants+' -_id')
        .unwind(restaurants)
        .replaceRoot(restaurants);

    optionalPagination(aggregation, limit, offset)
        .then(aggregationResults => {
            // esto es para ejecutar el toJSON sobre los aggregationResults
            const restaurantDocuments = aggregationResults.map(aggregationResult => new Restaurant(aggregationResult));
            res.json(restaurantDocuments);
        })
        .catch(next);
}

const updateRestaurant = function (req, res, next) {
    const { id, rating, name, address } = req.body;
    const restaurantId = req.params.restaurantId;
    const updatedRestaurant = { rating, name, address };

    if (!Types.ObjectId.isValid(id)) {
        throw new APIError(404);
    }

    Restaurant.validate(updatedRestaurant)
        .then(() => User.findOneAndUpdate(
            {
                _id: id,
                'restaurants._id': restaurantId
            },
            {
                $set: {
                    'restaurants.$.name': updatedRestaurant.name,
                    'restaurants.$.address': updatedRestaurant.address,
                    'restaurants.$.rating': updatedRestaurant.rating
                }
            }
        ))
        .then(result => {
            if(result) {
                res.status(204).send();
            } else {
                throw new APIError(404);
            }
        })
        .catch(next);
}

const deleteRestaurant = function (req, res, next) {
    const restaurantId = req.params.restaurantId;
    const id = req.body.id;
    let removedRestaurant;

    if (!Types.ObjectId.isValid(id)) {
        throw new APIError(404);
    }

    User.findById(id)
        .then(user => {
            if (!user) {
                throw new APIError(404);
            }

            removedRestaurant = user.restaurants.id(restaurantId);
            if (!removedRestaurant) {
                throw new APIError(404);
            }

            removedRestaurant.remove();
            return user.save();
        })
        .then(() => res.json(removedRestaurant))
        .catch(next);
}

const getRestaurantMeals = function (req, res, next) {
    const restaurantId = req.params.restaurantId;

    if (!Types.ObjectId.isValid(restaurantId)) {
        throw new APIError(404);
    }

    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);

    let query = Meal.find({ restaurant: restaurantId });
    optionalPagination(query, limit, offset)
        .then(meals => res.json(meals))
        .catch(next);
}

module.exports = {
    createRestaurant,
    getRestaurant,
    getRestaurants,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantMeals
}