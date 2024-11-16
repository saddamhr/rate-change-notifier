import nodemailer from 'nodemailer'
import config from '../config/config.js';


/**
 * Sends an email notification with the updated exchange rate information.
 * @param {Object} rateData - The rate data object.
 */
async function sendEmailNotification(rateData) {
  const { base, quote, sendingAmount, receivingAmount, rate, fee, time } = rateData;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  const mailOptions = {
    from: config.email.user,
    to: config.email.receiver,
    subject: "Exchange Rate Alert: Rate Increase Detected",
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

export default sendEmailNotification;
