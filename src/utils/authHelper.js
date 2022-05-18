const { SECRET } = require('../configs/jwt.config');
const { createHash } = require("crypto");
const { sign, verify } = require('jsonwebtoken');

const hash = (value) => {
    return createHash('sha256')
        .update(value)
        .digest('hex');
}

const getToken = (user) => {
    if (!SECRET) {
        return null;
    }
    return sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '2h' });
}

const validateToken = (token, callback) => {
    return verify(token, SECRET, {}, callback);
}

module.exports = {
    hash,
    getToken,
    validateToken
}