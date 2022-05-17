const logger = require('consola');
const crypto = require('crypto');

module.exports = function (req, res, next) {
    const requestId = crypto.randomUUID();
    const start = new Date();

    let requestLog = `REQUEST (${requestId}) IP: ${req.ip} | METHOD: ${req.method} | PATH: ${req.path}`;
    requestLog += req.body && Object.keys(req.body).length ? ` | BODY: ${JSON.stringify(req.body)}` : '';
    logger.info(requestLog);

    next();

    res.on('finish', function () {
        const end = new Date();
        const responseLog = `RESPONSE (${requestId}) responded with status ${this.statusCode} in ${end.getTime() - start.getTime()}ms`;
        logger.info(responseLog);
    });
}