const { Schema, model } = require('mongoose');
const { EMAIL_REGEX, ERROR_MESSAGES, ROLES } = require('../utils/constants');
const { restaurantSchema } = require('./restaurant');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, ERROR_MESSAGES.MANDATORY],
        },
        email: {
            type: String,
            required: [true, ERROR_MESSAGES.MANDATORY],
            unique: true,
            match: [EMAIL_REGEX, ERROR_MESSAGES.BAD_FORMAT]
        },
        balance: Number,
        password: {
            type: String,
            required: [true, ERROR_MESSAGES.MANDATORY],
        },
        role: {
            type: String,
            enum: Object.values(ROLES)
        },
        restaurants: {
            type: [restaurantSchema],
            default: undefined
        }
    },
    {
        collection: 'users',
        versionKey: false
    }
);

userSchema.set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
        delete object.password;
    }
});

const User = model('User', userSchema);
module.exports = {
    User
}