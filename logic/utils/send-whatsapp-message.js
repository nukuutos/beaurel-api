const twilio = require('twilio');

const { TWILIO_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

const sendWhatsappMessage = async (phoneNumber, message = 'Сообщение отправлено') => {
  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      body: message,
      to: `whatsapp:${phoneNumber}`,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendWhatsappMessage;
