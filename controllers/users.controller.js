const { User } = require('../models/user');
const { hash, getToken} = require('../utils/authHelper');
const { Types } = require('mongoose');
const { APIError } = require('../utils/APIError')
const { ERROR_MESSAGES } = require('../utils/constants');

const singUp = function (req, res, next) {
    const { username, password, email } = req.body;
    const newUser = new User({
        username,
        password: hash(password),
        email,
        balance: 100
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
    const { limit, offset } = req.query;
    User.find()
        .skip(offset)
        .limit(limit)
        .then(users => {
            res.json(users);
        })
        .catch(next);
}

const login = function (req, res, next) {
    const { email, password } = req.body;
    if (!email) {
        throw new APIError(401);
    }
    User.find( { email })
        .then(users => {
            if (!users || users[0].password !== hash(password)) {
                throw new APIError(401, ERROR_MESSAGES.BAD_CREDENTIALS);
            }
            const token = getToken(users[0].id);
            res.json({ token });
        });
}

module.exports = {
    singUp,
    getUser,
    getUsers,
    login
}