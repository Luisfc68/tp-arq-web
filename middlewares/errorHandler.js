const errorHandler = function (err, req, res, next) {
    if (err.name === 'APIError') {
        res.status(err.status).json(err.error);
    } else if (err.name === 'ValidationError') {
        for (let prop in err.errors) {
            err.errors[prop] = err.errors[prop].message;
        }
        res.status(400).json(err.errors);
    } else {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}

module.exports = {
    errorHandler
}