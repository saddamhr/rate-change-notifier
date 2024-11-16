import cron from 'node-cron'
import fetchExchangeRate from './services/fetchRate.js'
import sendEmailNotification from './services/emailNotification.js'
import logger from './utils/logger.js'
import config from './config/config.js';

let previousRate = null;

/**
 * Checks the exchange rate and sends a notification if the rate increases.
 */
async function checkRate() {
  try {
    const rateData = await fetchExchangeRate();
    const currentRate = rateData.rate;

    if (previousRate && currentRate > previousRate) {
      logger.logInfo(`Rate increased from ${previousRate} to ${currentRate}. Sending notification.`);
      await sendEmailNotification(rateData);
    }

    previousRate = currentRate;
  } catch (error) {
    logger.logError("Error in checkRate: " + error.message);
  }
}

// Schedule the rate check
cron.schedule(config.scheduleInterval, checkRate);
logger.logInfo("Exchange rate notifier is running...");
