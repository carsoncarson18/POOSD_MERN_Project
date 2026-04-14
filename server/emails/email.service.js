const transporter = require('../config/nodemailer');

require("dotenv").config({ path: __dirname + "/.env" });


const sendEmail = async(to, subject, html, text = "") => {
    try {
        const mailOptions = {
            from: `"Scraps" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId)
        return { messageId: info.messageId};
    } catch (err) {
        console.error("Error sending email: ", err);
        return {error: err.message};
    }
}

const sendVerificationEmail = async(email, url, titleTxt, btnTxt) => {
    const verifyLink = url;
    const subject = "Verify Email Address for Scraps";
    const html = `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Email Confirmation</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style type="text/css">
                    @media screen {
                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                    }

                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                    }
                    }

                    body,
                    table,
                    td,
                    a {
                    -ms-text-size-adjust: 100%;
                    /* 1 */
                    -webkit-text-size-adjust: 100%;
                    /* 2 */
                    }

                    table,
                    td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                    }

                    img {
                    -ms-interpolation-mode: bicubic;
                    }

                    a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    }

                    div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                    }

                    body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    }

                    table {
                    border-collapse: collapse !important;
                    }

                    a {
                    color: #1a82e2;
                    }

                    img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                    }

                    .countdown {
                    font-size: 16px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    color: #ff0000;
                    }
                </style>
                </head>

                <body style="background-color: #e9ecef;">

                <!-- start preheader -->
                <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                    Email Confirmation Notification
                </div>
                <!-- end preheader -->

                <!-- start body -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">

                    <!-- start logo -->
                    <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="padding: 36px 24px;">
                            <a href="#" target="_blank" style="display: inline-block;">
                                <!-- <img src="logo-url-here" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;"> -->
                            </a>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                    <!-- end logo -->

                    <!-- start hero -->
                    <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">${titleTxt}</h1>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                    <!-- end hero -->

                    <!-- start copy block -->
                    <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                        <!-- start copy -->
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                            <p style="margin: 0;">Click the button below to confirm your email.</p>
                            </td>
                        </tr>
                        <!-- end copy -->

                        <!-- start button -->
                        <tr>
                            <td align="left" bgcolor="#ffffff">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" bgcolor="#004ac2" style="border-radius: 6px;">
                                        <a href="${verifyLink}" target="_blank" style="display: inline-block; padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">${btnTxt}</a>
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <!-- end button -->

                        <!-- start copy -->
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                            <p style="margin: 0;">If that doesn't work, you can click the following link below:</p>
                            <p style="margin: 0;"><a href="${verifyLink}" target="_blank">Click this link</a></p>
                            </td>
                        </tr>
                        <!-- end copy -->

                        <!-- start copy -->
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                            <p style="margin: 0;">Thanks,<br>-- Scraps Support Team --</p>
                            </td>
                        </tr>
                        <!-- end copy -->

                        </table>
                    </td>
                    </tr>
                    <!-- end copy block -->

                    <!-- start footer -->
                    <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                        <!-- start permission -->
                        <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">You received this email because we received a request for your account in our website. If this isn't for you, you can safely delete this email.</p>
                            </td>
                        </tr>
                        <!-- end permission -->

                        <!-- start unsubscribe -->
                        <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">Scraps</p>
                            </td>
                        </tr>
                        <!-- end unsubscribe -->

                        </table>
                    </td>
                    </tr>
                    <!-- end footer -->

                </table>
                <!-- end body -->

                </body>
                </html>
    `;
    return await sendEmail(email, subject, html);
}

// Automated email for when ingredients are claimed
const sendClaimEmail = async(poster, claimer, ingredient, neighborhood) => {
    const subject = `Your ingredient "${ingredient.name}" has been claimed!`
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Your Ingredient Has Been Claimed!</h2>
      
      <p>Hello <strong>${poster.firstName || 'there'}</strong>!</p>
      
      <p>Your Neighbor <strong>${claimer.firstName || 'Someone'}</strong> has claimed the ingredient you posted in the <strong>${neighborhood.name}</strong> neighborhood!</p>
      
      <!-- Card with image on the right - responsive -->
      <div style="background-color: #f5f5f5; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; padding-right: 20px;">
              <h3 style="margin-top: 0; color: #333;">Ingredient Details:</h3>
              <p><strong>Name:</strong> ${ingredient.name}</p>
              <p><strong>Quantity:</strong> ${ingredient.quantity?.value || 'N/A'} ${ingredient.quantity?.unit || ''}</p>
              <p><strong>Description:</strong> ${ingredient.description || 'No description provided'}</p>
              <p><strong>Category:</strong> ${ingredient.category || 'Other'}</p>
              <p><strong>Expires:</strong> ${new Date(ingredient.expiresAt).toLocaleDateString()}</p>
            </td>
            ${ingredient.imageUrl ? `
              <td style="vertical-align: top; text-align: center; width: 150px;">
                <img 
                  src="${ingredient.imageUrl}" 
                  alt="${ingredient.name}" 
                  style="max-width: 150px; max-height: 150px; width: auto; height: auto; border-radius: 8px; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                />
              </td>
            ` : ''}
          </tr>
        </table>
      </div>
      
      <div style="background-color: #e8f5e9; border-radius: 10px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4CAF50;">Claimer Information:</h3>
        <p><strong>Name:</strong> ${claimer.firstName || 'Unknown'}</p>
        <p><strong>Email:</strong> ${claimer.email || 'No email provided'}</p>
        <p><strong>Claimed Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="background-color: #e1f6e2; border-radius: 10px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #429644;">Next Steps:</h3>
        <p>Please reach out to <strong>${claimer.firstName || 'the claimant'}</strong> to arrange pickup or delivery of the ingredient.</p>
        <p>We recommend coordinating within the next 24 hours!</p>
      </div>
      
      <hr />
      <p style="color: #666; font-size: 12px;">
        This is an automated message from Scraps. Please do not reply to this email.<br/>
        If you have any issues, please contact support, which, in your case, doesn't exist 😉
      </p>
    </div>
    `
   
    return await sendEmail(poster.email, subject, html);
}
module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendClaimEmail
}