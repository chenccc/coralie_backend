"use strict";
const nodeMailer = require("nodemailer"),
    config = require("../config/config.js"),
    utils = require('../utils/utils.js');

exports.generateEmailBodyWithOtp = function(guestName, otp, callback){
        let htmlMessage = "Hello <b>" + guestName + "</b>, <br> Please use this OTP for you authentication. <br/><b>" + otp + "</b>";
        let plainMessage = "Hello " + guestName + ",\n Please use this OTP for you authentication. \nOTP is: " + otp;
        callback(undefined, plainMessage, htmlMessage);
};
exports.sendEmailToGuest = async function (from, to, subject, plainText, message, callback) {
    let testAccount = await nodeMailer.createTestAccount();//TO-DO: remove this line and also remove async and await
    let transporter = nodeMailer.createTransport({
        host: config.smpt_host,
        port: config.smtp_port,
        secure: config.smpt_secure, // true for 465, false for other ports
        auth: {
            user: testAccount.user, //config.smpt_user// TO-DO: change it later
            pass: testAccount.pass //config.smpt_pass// TO-DO: change it later
        }
    });
    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: plainText,
        html: message
    };
    utils.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return utils.log(error);
        }
        utils.log('Message %s sent: %s', info.messageId, info.response);
        utils.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
        callback(undefined, info);
    });
};


