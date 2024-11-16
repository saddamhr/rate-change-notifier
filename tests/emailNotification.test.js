// Import the required modules and functions
const nodemailer = require('nodemailer');
const sendEmailNotification = require('../src/services/emailNotification');

jest.mock('nodemailer'); // Mock Nodemailer

describe('sendEmailNotification', () => {
  it('should send an email', async () => {
    // Mock the Nodemailer transport and sendMail method
    const sendMailMock = jest.fn().mockResolvedValue('Email sent');
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    // Test data
    const rateData = { 
      rate: 120, 
      base: "USD", 
      quote: "BDT", 
      sendingAmount: 500, 
      receivingAmount: 60000 
    };

    // Call the function
    await sendEmailNotification(rateData);

    // Expectations
    expect(sendMailMock).toHaveBeenCalledTimes(1); // Ensure sendMail is called once
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: expect.any(String),
      to: expect.any(String),
      subject: expect.any(String),
      html: expect.any(String),
    }));
  });
});
