const fs = require('fs');
const csv = require('csv-parser');
const twilio = require('twilio');

// Twilio credentials, will make them private later
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = new twilio(accountSid, authToken);

// Add your phone number here
const fromPhoneNumber = 'your_twilio_phone_number';

// CSV file path, double check format
const csvFilePath = 'contacts.csv';

// Method to send SMS
const sendSms = (to, message) => {
  client.messages
    .create({
      body: message,
      from: fromPhoneNumber,
      to: to
    })
    .then(message => console.log(`Message sent to ${to}: ${message.sid}`))
    .catch(error => console.error(`Failed to send message to ${to}:`, error));
};

// Read and parse the CSV file
const sendMessagesFromCsv = (csvFilePath) => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const { phoneNumber, message } = row;
      sendSms(phoneNumber, message);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
};

// Start sending messages
sendMessagesFromCsv(csvFilePath);
