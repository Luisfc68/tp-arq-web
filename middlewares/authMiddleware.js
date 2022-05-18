const { validateToken } = require("../utils/authHelper");
const { APIError } = require("../utils/APIError");
const authMiddleware = function (...roles) {
    return function (req, res, next) {
        let token = req.get('Authorization');
        token = token.replace('Bearer ', '');
        validateToken(token, (err, decoded) => {
            if (err) {
                throw new APIError(401, err.message);
            } else if (!roles.some(role => role === decoded.role)) {
                throw new APIError(403);
            }
            req.body.id = decoded.id;
            next();
        });
    }
}

module.exports = {
    authMiddleware
}