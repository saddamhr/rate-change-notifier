import express from 'express';
import cron from 'node-cron';
import fetchExchangeRate from './services/fetchRate.js';
import sendEmailNotification from './services/emailNotification.js';
import logger from './utils/logger.js';
import config from './config/config.js';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(new URL(import.meta.url).pathname);


let previousRate = null;

// Middleware to parse JSON bodies for subscription API
app.use(express.json());

// Serve static files (like HTML) from the "public" directory
app.use(express.static(path.resolve('src/public')));
app.use(express.urlencoded({ extended: true }));

const filePath = path.join(__dirname, 'data/subscribers.json');

// Load subscribers from the JSON file
const getSubscribers = () => {
  const data = fs.readFileSync(path.resolve('src/data/subscribers.json'), 'utf8');
  return JSON.parse(data);
};

// Save a new subscriber to the JSON file
const saveSubscriber = (email) => {
  const subscribers = getSubscribers();
  subscribers.push({ email });
  fs.writeFileSync(path.resolve('src/data/subscribers.json'), JSON.stringify(subscribers, null, 2));
};

// Route to serve the subscription page (HTML)
app.get('/subscribe', (req, res) => {
  res.sendFile(path.resolve('src/public/subscribe.html'));
});

// Handle form submission
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  // Read the current subscribers file
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).send("Error reading subscribers file");
      }

      const subscribers = JSON.parse(data);

      // Add the new email to the subscribers list
      if (!subscribers.includes(email)) {
          subscribers.push(email);

          // Write the updated list back to the file
          fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), (err) => {
              if (err) {
                  return res.status(500).send("Error saving subscriber");
              }

              res.send("<h1>Thank you for subscribing!</h1><p>We'll notify you about rate changes.</p>");
          });
      } else {
          res.send("<h1>You're already subscribed!</h1><p>Thanks for staying with us.</p>");
      }
  });
});

// Endpoint to simulate sending rate alert to all subscribers (for testing)
app.get('/send-rate-alert', async (req, res) => {
  try {
    const rateData = await fetchExchangeRate();
    await sendRateAlertToAllSubscribers(rateData);
    res.send('Rate alert sent to all subscribers!');
  } catch (error) {
    res.status(500).send('Error sending rate alert');
  }
});

// Send rate alert to all subscribers
const sendRateAlertToAllSubscribers = async (rateData) => {
  const subscribers = getSubscribers();

  for (const subscriber of subscribers) {
    try {
      await sendEmailNotification(subscriber.email, rateData);
      logger.logInfo(`Notification sent to ${subscriber.email}`);
    } catch (error) {
      logger.logError(`Error sending email to ${subscriber.email}: ${error.message}`);
    }
  }
};

// Periodically check the exchange rate and notify users if rate increases
async function checkRate() {
  try {
    const rateData = await fetchExchangeRate();
    const currentRate = rateData.rate;

    if (previousRate && currentRate > previousRate || true) {
      logger.logInfo(`Rate increased from ${previousRate} to ${currentRate}. Sending notification.`);
      await sendRateAlertToAllSubscribers(rateData);
    }

    previousRate = currentRate;
  } catch (error) {
    logger.logError("Error in checkRate: " + error.message);
  }
}

// Schedule the rate check every configured interval
cron.schedule(config.scheduleInterval, checkRate);

// Start the server
app.listen(PORT, () => {
  logger.logInfo(`Server is running on http://localhost:${PORT}`);
});
