class APIError extends Error {

    name = 'APIError';

    constructor(status, error) {
        super();
        this.status = status;
        this.error = error;
    }

}

module.exports = {
    APIError
}