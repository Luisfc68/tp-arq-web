const { Schema, model, Types } = require('mongoose');
const { ERROR_MESSAGES } = require("../utils/constants");

const orderSchema = new Schema(
    {
        items: [
            {
                _id: false,
                quantity: {
                    type: Number,
                    min: [1, ERROR_MESSAGES.minimum(1)],
                    required: [true, ERROR_MESSAGES.MANDATORY]
                },
                meal: {
                    id: {
                        required: [true, ERROR_MESSAGES.MANDATORY],
                        type: Types.ObjectId,
                        ref: 'Meal'
                    },
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
                    }
                }
            }
        ],
        user: {
            required: [true, ERROR_MESSAGES.MANDATORY],
            type: Types.ObjectId,
            ref: 'User'
        }
    },
    {
        versionKey: false,
        collection: 'orders'
    }
);

orderSchema.virtual('total').get(function () {
    return this.items
        .map(item => item.quantity * item.meal.price)
        .reduce((total, itemSubtotal) => total + itemSubtotal, 0);
});

orderSchema.set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        object.items.forEach(item => {
            item.meal.image = `/meals/${item.meal.id}/image`
            item.subtotal = item.meal.price * item.quantity;
        });
        object.total = document.total;
        delete object._id;
    }
});

const Order = model('Order', orderSchema);

module.exports = {
    Order
}