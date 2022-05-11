const logger = require('consola');
const crypto = require('crypto');

module.exports = function (req, res, next) {
    const requestId = crypto.randomUUID();

    let requestLog = `REQUEST (${requestId}) IP: ${req.ip} | METHOD: ${req.method} | PATH: ${req.path}`;
    requestLog += req.body && Object.keys(req.body).length ? ` | BODY: ${JSON.stringify(req.body)}` : '';
    logger.info(requestLog);

    next();

    res.on('finish', function () {
        let responseLog = `RESPONSE (${requestId}) STATUS: ${this.statusCode}`;
        responseLog += this.body &&  Object.keys(this.body).length ? ` | BODY: ${JSON.stringify(this.body)}` : '';
        logger.info(responseLog);
    });
}