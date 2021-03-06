const { User } = require('../models/user');
const { hash, getToken} = require('../utils/authHelper');
const { Types } = require('mongoose');
const { APIError } = require('../utils/APIError')
const { ERROR_MESSAGES, ROLES } = require('../utils/constants');
const { optionalPagination } = require("../utils/paginationUtils");

const singUp = function (req, res, next, isRestaurant) {
    const { username, password, email } = req.body;

    const newUser = new User({
        username,
        password: hash(password),
        email,
        balance: isRestaurant? undefined : 100,
        role: isRestaurant? ROLES.RESTAURANT : ROLES.CLIENT,
        restaurants: isRestaurant? [] : undefined
    });

    User.validate(newUser)
    .then(() => User.find({ email }).exec())
    .then(userDocument => {
        if (userDocument.length) {
            throw new APIError(409, ERROR_MESSAGES.UNIQUE_EMAIL);
        } else {
            return newUser.save();
        }
    })
    .then(savedUser => res.status(201).json(savedUser))
    .catch(next);
}

const singUpClient = function (req, res, next) {
    singUp(req, res, next, false);
}

const singUpRestaurant = function (req, res, next) {
    singUp(req, res, next, true);
}

const getUser = function (req, res, next) {
    const userId = req.params.userId;
    if (!Types.ObjectId.isValid(userId)) {
        throw new APIError(404);
    }
    User.findById(userId)
        .then(userDocument => {
            if (userDocument) {
                res.json(userDocument);
            } else {
                throw new APIError(404);
            }
        })
        .catch(next);
}

const getUsers = function (req, res, next) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);

    let query = User.find();

    optionalPagination(query, limit, offset)
        .then(users => res.json(users))
        .catch(next);
}

const login = function (req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new APIError(400, {
            email: email? ERROR_MESSAGES.MANDATORY : undefined,
            password: password? ERROR_MESSAGES.MANDATORY : undefined
        });
    }
    User.find( { email })
        .then(users => {
            if (!users.length || users[0].password !== hash(password)) {
                throw new APIError(401, ERROR_MESSAGES.BAD_CREDENTIALS);
            }
            const token = getToken(users[0]);
            res.json({ token });
        })
        .catch(next);
}

const updateUser = function (req, res, next) {
    const { email, username, password, id } = req.body;
    const update = { email, username, password: hash(password) };
    User.validate(update)
        .then(() => User.findByIdAndUpdate(id, update))
        .then(result => {
            if(result) {
                res.status(204).send();
            } else {
                res.status(404).send();
            }
        })
        .catch(next);
}

const deleteUser = function (req, res, next) {
    const id = req.body.id;
    User.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).send();
            }
        })
        .catch(next);
}

const addMoneyToAccount = function (req, res, next) {
    const { id, amount } = req.body;
    if(isNaN(amount) || amount <= 0) {
        throw new APIError(400, ERROR_MESSAGES.BAD_FORMAT);
    }

    User.findById(id)
        .then(user => {
            if (user) {
                user.balance += amount;
                return user.save();
            } else {
                throw new APIError(404);
            }
        })
        .then(updatedUser => res.json(updatedUser))
        .catch(next);
}

module.exports = {
    singUpRestaurant,
    singUpClient,
    getUser,
    getUsers,
    login,
    updateUser,
    deleteUser,
    addMoneyToAccount
}