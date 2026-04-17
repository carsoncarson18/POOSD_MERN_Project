const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error: ", error);
  } else {
    console.log("Email server is ready to send messages!");
  }
});

module.exports = transporter;