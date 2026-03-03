const { nanoid } = require('nanoid');

const generateShortCode = (length = 7) => nanoid(length);

module.exports = generateShortCode;
