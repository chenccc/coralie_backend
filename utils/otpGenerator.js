const otpGenerator = require("otp-generator"),
    moment = require('moment'),
config = require('../config/config.js');


exports.generateOtp = function (callback) {
    let token = otpGenerator.generate(config.otp_length, {alphabets: false, upperCase: false, specialChars: false, digits: true});
    callback(undefined, token);
};