const { nanoid } = require('nanoid');

const generateShortCode = (length = 6) => nanoid(length);

module.exports = generateShortCode;
