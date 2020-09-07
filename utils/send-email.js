const sgMail = require('@sendgrid/mail');

module.exports = (email, title, message) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: title,
    text: message,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  sgMail.send(msg);
};
