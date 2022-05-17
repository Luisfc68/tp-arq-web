const { createHash } = require('crypto');
const { User } = require('../models/user');
const { Types } = require('mongoose');
const { APIError } = require('../utils/APIError')
const { ERROR_MESSAGES } = require('../utils/constants');
const hash = createHash('sha256');

const singUp = function (req, res, next) {
    const { username, password, email } = req.body;
    hash.update(password);
    const newUser = new User({
        username,
        password: hash.copy().digest('hex'),
        email,
        balance: 100
    });

    User.validate(newUser)
    .then(() => User.find({ email }).exec())
    .then(userDocument => {
        if (userDocument.length) {
            throw new APIError(409, { error: ERROR_MESSAGES.UNIQUE_EMAIL });
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

module.exports = {
    singUp,
    getUser,
    getUsers
}