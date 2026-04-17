const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASS?.replace(/\s+/g, ""),
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
