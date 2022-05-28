const { Meal } = require('../models/meal');
const { APIError } = require("../utils/APIError");
const { ERROR_MESSAGES } = require("../utils/constants");
const { Types } = require("mongoose");
const { Order } = require("../models/order");
const { User } = require("../models/user");
const { optionalPagination } = require("../utils/paginationUtils");

const createOrder = function (req, res, next) {
    let newOrder;
    const { items, id } = req.body;
    if (!items) {
        res.status(404).json({ items: ERROR_MESSAGES.MANDATORY });
    }
    const meals = items.map(item => {
        if (!item.mealId) {
            return Promise.reject(new APIError(404));
        } else if (Types.ObjectId.isValid(item.mealId)) {
            return Meal.findById(item.mealId);
        } else {
            return Promise.resolve(null);
        }
    });

    Promise.all(meals)
        .then(mealDocuments => {
            if (mealDocuments.some(doc => doc == null)) {
                const unavailableIndexes = mealDocuments
                    .map((doc, index) => doc == null? index : null)
                    .filter(index => index != null);
                const unavailableItems = items.map(item => item.mealId)
                    .filter((_, index) => unavailableIndexes.includes(index));
                throw new APIError(409, ERROR_MESSAGES.notAvailable(unavailableItems));
            }

            const orderData = items.map((item, index) => {
                return {
                    quantity: item.quantity,
                    meal: {
                        id:  mealDocuments[index].id,
                        name:  mealDocuments[index].name,
                        description: mealDocuments[index].description,
                        price: mealDocuments[index].price
                    }
                }
            });
            newOrder = new Order({ items: orderData, user: id });
            return Order.validate(newOrder);
        })
        .then(() => User.findById(id))
        .then(user => {
            if (!user) {
                throw new APIError(404);
            } else if (user.balance < newOrder.total) {
                throw new APIError(409, ERROR_MESSAGES.NO_MONEY);
            }
            user.balance = user.balance - newOrder.total;
            return user.save();
        })
        .then(() => newOrder.save())
        .then(() => res.status(201).json(newOrder))
        .catch(next);
}

const getOrders = function (req, res, next) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const user = req.body.id;

    optionalPagination(Order.find({ user }), limit, offset)
        .then(orders => res.json(orders))
        .catch(next);
}

module.exports = {
    createOrder,
    getOrders
}