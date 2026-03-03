const generateShortCode = require('./generateShortCode');

const MAX_RETRIES = 10;

/**
 * Generates a random 6-character short code that does not already exist
 * in the database.
 *
 * @param {object} UrlModel - Mongoose model with an `exists` method.
 * @returns {Promise<string>} A unique short code.
 * @throws {Error} If a unique code cannot be generated within MAX_RETRIES attempts.
 */
const generateUniqueShortCode = async (UrlModel) => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const shortCode = generateShortCode();
    const exists = await UrlModel.exists({ shortCode });
    if (!exists) {
      return shortCode;
    }
  }
  throw new Error('Unable to generate a unique short code. Please try again.');
};

module.exports = generateUniqueShortCode;
