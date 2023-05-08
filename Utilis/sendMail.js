const nodemailer = require("nodemailer");

let recipients = [
  "gavalijayesh7174@gmail.com",
  "borsev662@gmail.com",
  "chinmay99v@gmail.com",
];

const sendMail = async (recipients) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gavalijayesh9@gmail.com",
      pass: "tjmvygusrrixpnew",
    },
  });

  recipients.forEach((recipient) => {
    let mailOptions = {
      from: "gavalijayesh9@gmail.com",
      to: recipient,
      subject: "Mail Testing",
      text: "Dear User, \n\n This mail is sent simultaneouly \n\nBest regards,\nYours faithfully ",
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error sending email to ${recipient}: ${error}`);
      } else {
        console.log(`Email sent to ${recipient}: ${info.response}`);
      }
    });
  });
};
