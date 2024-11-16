const cron = require("node-cron");
const fetchExchangeRate = require("./services/fetchRate");
const sendEmailNotification = require("./services/emailNotification");
const logger = require("./utils/logger");
const { scheduleInterval } = require("./config/config");

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
cron.schedule(scheduleInterval, checkRate);
logger.logInfo("Exchange rate notifier is running...");
