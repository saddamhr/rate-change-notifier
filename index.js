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
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #4CAF50;">📈 Exchange Rate Alert</h2>
        <p>Hello,</p>
        <p>We are excited to inform you that the exchange rate has increased! Here are the updated details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Details</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Values</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Base Currency</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${base}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Quote Currency</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${quote}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Sending Amount</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${sendingAmount} ${base}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Receiving Amount</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${receivingAmount} ${quote}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Current Rate</td>
            <td style="border: 1px solid #ddd; padding: 8px; color: #4CAF50;"><strong>${rate}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Transaction Fee</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${fee}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Update Time</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(time).toLocaleString()}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Thank you for using our service. We hope this information helps you make timely financial decisions.</p>
        <p style="text-align: center; color: #777; font-size: 12px;">&copy; ${new Date().getFullYear()} Exchange Rate Notifier, Inc.</p>
      </div>
    `,
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
    if (previousRate && currentRate > previousRate || true) {
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
