require("dotenv").config();

module.exports = {
  apiUrl: process.env.API_URL,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    receiver: process.env.RECEIVER_EMAIL,
  },
  scheduleInterval: "* * * * *", // Cron interval to run every minute
};
