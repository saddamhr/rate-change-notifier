import axios from 'axios';
import config from './../config/config.js';

/**
 * Fetches the latest exchange rate from the API.
 * @returns {Promise<Object>} The exchange rate data.
 */
async function fetchExchangeRate() {
  try {
    const response = await axios.get(config.apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching the exchange rate:', error);
    throw error;
  }
}

export default fetchExchangeRate