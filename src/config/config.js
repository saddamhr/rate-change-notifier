import dotenv from 'dotenv'

dotenv.config()

export default {
  apiUrl: process.env.API_URL,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  scheduleInterval: "* * * * *", // Cron interval to run every minute
};
