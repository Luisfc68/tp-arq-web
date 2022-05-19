const { Schema, model, Types } = require('mongoose');
const { ERROR_MESSAGES } = require("../utils/constants");

const mealSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, ERROR_MESSAGES.MANDATORY],
        },
        description: {
            type: String,
            required: [true, ERROR_MESSAGES.MANDATORY],
        },
        price: {
            type: Number,
            min: [0, ERROR_MESSAGES.minimum(0)],
            required: [true, ERROR_MESSAGES.MANDATORY]
        },
        restaurant: {
            required: [true, ERROR_MESSAGES.MANDATORY],
            type: Types.ObjectId,
            ref: 'Restaurant'
        }
    },
    {
        versionKey: false,
        collection: 'meals'
    }
);

mealSchema.set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
    }
});

mealSchema.virtual('image').get(function() {
    return `/meals/${this.id}/image`;
});

const Meal = model('Meal', mealSchema);

module.exports = {
    Meal
}