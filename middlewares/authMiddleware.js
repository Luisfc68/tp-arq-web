const { validateToken } = require("../utils/authHelper");
const { APIError } = require("../utils/APIError");
const authMiddleware = function (req, res, next) {
    let token = req.get('Authorization');
    token = token.replace('Bearer ', '');
    validateToken(token, (err, decoded) => {
        if (err) {
            throw new APIError(401, err.message);
        }
        req.body.id = decoded.id;
        next();
    });

}

module.exports = {
    authMiddleware
}