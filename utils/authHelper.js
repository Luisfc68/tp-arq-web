const { SECRET } = require('../configs/jwt.config');
const { createHash } = require("crypto");
const { sign, verify } = require('jsonwebtoken');
const hashSha256 = createHash('sha256');

const hash = (value) => {
    hashSha256.update(value);
    return hashSha256.copy().digest('hex');
}

const getToken = (userId) => {
    if (!SECRET) {
        return null;
    }
    return sign({ id: userId }, SECRET, { expiresIn: '2h' });
}

const validateToken = (token, callback) => {
    return verify(token, SECRET, {}, callback);
}

module.exports = {
    hash,
    getToken,
    validateToken
}