const { ERROR_MESSAGES } = require("../utils/constants");

const errorHandler = function (err, req, res, next) {
    if (err.name === 'APIError') {
        res.status(err.status);
        err.error? res.json({ error: err.error }) : res.send();
    } else if (err.name === 'ValidationError') {
        for (let prop in err.errors) {
            err.errors[prop] = err.errors[prop].message || ERROR_MESSAGES.MANDATORY;
        }
        res.status(400).json(err.errors);
    } else if (err.name === 'TypeError') {
        res.status(400).json({ error: ERROR_MESSAGES.BAD_FORMAT });
    } else {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}

module.exports = {
    errorHandler
}