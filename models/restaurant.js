const { Schema, model } = require('mongoose');
const {ERROR_MESSAGES} = require("../utils/constants");

const minimumRating = 0;
const maximumRating = 5;

const restaurantSchema = new Schema({
        name: {
            type: String,
            required: [true, ERROR_MESSAGES.MANDATORY],
        },
        address: {
            type: String,
            required: [true, ERROR_MESSAGES.MANDATORY],
        },
        rating: {
            type: Number,
            required: [true, ERROR_MESSAGES.MANDATORY],
            min: [minimumRating, ERROR_MESSAGES.outOfRange(minimumRating, maximumRating)],
            max: [maximumRating, ERROR_MESSAGES.outOfRange(minimumRating, maximumRating)]
        }
    },
    {
        versionKey: false
    }
);

restaurantSchema.set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
    }
});

const Restaurant = model('Restaurant', restaurantSchema);
module.exports = {
    Restaurant,
    restaurantSchema
}