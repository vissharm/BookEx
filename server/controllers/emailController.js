const nodemailer = require("nodemailer");
const emailController = {};

emailController.sendEmail = async (req, res, next) => {
  const { email, username } = req.body;
  console.log(email);
  console.log(req.customData);
  if (!req.customData)
    return;
  var encryptedPwd = req.customData.password;
  console.log(encryptedPwd, email)

  const { to, subject, text } = req.body;
  let emailData = {};
  if (to && subject && text) {
    emailData = { to, subject, text }; 
  } else {
    emailData.text = `Hi ${username}, Password reset successfully. Please change the system generated password ASAP. New password: ${encryptedPwd}`;
    emailData.to = email;
    emailData.subject = '[Confidential] Delete the email permanently once the content read.'
  }

  try{
    if (!emailData.subject || !emailData.to || !emailData.text) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "e3f3499d3a6b70",
        pass: "2e2007bcb340c8"
      }
    });

    const mailOptions = {
      from: '"BookEx Notifier" <upsercure.access@gmail.com>',
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: `<p>${emailData.text}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return next(error);
      }
      console.log("Email sent successfully:", info);
      next();
    });
  }
  catch (err) {
    console.log(err)
    return next(err)
  }
};

module.exports = emailController;