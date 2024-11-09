const axios = require("axios");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
require("dotenv").config();

let previousRate = null; // Store the previous rate for comparison

// Function to fetch the current exchange rate
async function fetchExchangeRate() {
  try {
    const response = await axios.get(process.env.API_URL);
    const { rate } = response.data;

    console.log(`Current rate: ${rate}`);
    return rate;
  } catch (error) {
    console.error("Error fetching the exchange rate:", error);
  }
}

// Function to send an email notification
async function sendEmailNotification(rate) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: "Exchange Rate Alert: Rate Increase",
    text: `The exchange rate has increased to ${rate}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to check the rate and compare with previous rate
async function checkRate() {
  const currentRate = await fetchExchangeRate();
  console.log(currentRate)

  if (currentRate !== null) {
    // Check if the rate has increased
    if (previousRate && currentRate > previousRate) {
      console.log("Rate increased! Sending notification...");
      await sendEmailNotification(currentRate);
    }

    // Update previous rate to the current rate for future comparisons
    previousRate = currentRate;
  }
}

// Schedule the check to run every minute
cron.schedule("* * * * *", checkRate); // Checks every minute

console.log("Exchange rate notifier is running. Monitoring for rate increases...");
