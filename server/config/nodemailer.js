const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = sgMail;