const axios = require("axios");
const { apiUrl } = require("../config/config");

/**
 * Fetches the latest exchange rate from the API.
 * @returns {Promise<Object>} The exchange rate data.
 */
async function fetchExchangeRate() {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching the exchange rate:", error);
    throw error;
  }
}

module.exports = fetchExchangeRate;
