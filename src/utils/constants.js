const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const ERROR_MESSAGES = {
    BAD_FORMAT: 'Invalid field format',
    MANDATORY: 'Its a mandatory field',
    UNIQUE_EMAIL: 'There is already a user with that email',
    BAD_CREDENTIALS: 'Invalid credentials',
    BAD_QUERY: 'Invalid value on query string',
    outOfRange: (min, max) => `Value is out of its allowed range [${min},${max}]`,
    minimum: min => `Value can't be lower than ${min}`,
    notFound: (name) => `${name} not found`,
    RESTAURANT_OWNER: 'Restaurant does not belong to user',
    notAvailable: items => `There is no stock for the following items ${items.join(', ')}`,
    NO_MONEY: 'Not enough money'
}
const ROLES = {
    CLIENT: 'CLIENT',
    RESTAURANT: 'RESTAURANT'
}

module.exports = {
    EMAIL_REGEX,
    ERROR_MESSAGES,
    ROLES: Object.freeze(ROLES)
}