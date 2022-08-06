/*globals  require, exports */

const mongoose = require("mongoose"),
    config = require("../config/config.js"),
    User = require("../models/user.js"),
    utils = require("../utils/utils.js");

// Function to establish connection for the Database
exports.connectToDb = function (callback) {
    utils.connectToDb(callback);
};

exports.getUsers = function (page, limit, callback) {
    // Fetch the all users
    if (page === 0 || limit === 0) {
        User.find({}, function (err, success) {
            if (err) {
                utils.log("[getDoc] Error fetching the doc " + err);
                callback(err);
                return;
            }
            callback(undefined, success);
        });
    } else {
        User.paginate({}, {page: page, limit: limit, lean: false}, function (err, success) {
            if (err) {
                utils.log("[getDoc] Error fetching the doc " + err);
                callback(err);
                return;
            }
            callback(undefined, success);
        });
    }
};

// Function to get the information of a matched document
exports.getUser = function (email, callback) {
    // Fetch the single user information
    User.find({email: email}, function (err, success) {
        if (err) {
            utils.log("[getDoc] Error fetching the doc " + err);
            callback(err);
            return;
        }
        callback(undefined, success);
    });
};

exports.login = function (userInfo, callback) {
    User.find({email: userInfo.email, pass: userInfo.pass}, function (err, success) {
        if (err) {
            utils.log("[getDoc] Error fetching the doc " + err);
            callback(err);
            return;
        }
        callback(undefined, success);
    });
}

// Function to create / update the Document for a user
exports.createUser = function (userInfo, callback) {
    let user;
    User.find({email: userInfo.email}, function (err, success) {
        if (err) {
            utils.log("[getDoc] Error fetching the doc " + err);
            callback(err);
            return;
        }
        // If the user is available, Then update the existing document
        if (success.length > 0) {
            user = success[0];
            const query = {email: userInfo.email};
            const newValue = {$set: userInfo};
            User.findOneAndUpdate(query, newValue, {upsert: true, new: true}, function (err, success) {
                if (err) {
                    utils.log("[updateUser] Error updating the doc " + err);
                    callback(err);
                    return;
                }
                callback(undefined, success);
            });
            return;
        }
        // If the user is not available then create new document for User
        let date = new Date().toISOString();
        // To create the model for new User
        user = User({
            "email": userInfo.email,
            "firstName": userInfo.firstName,
            "lastName": userInfo.lastName,
            "pass": userInfo.pass,
            "role": userInfo.role,
            "lastUpdate": date,
            "lastLogin": date,
            "lastUpdateBy": date,
            "features": userInfo.features
        });
        // Saving the User model
        user.save(function (err, success) {
            if (err) {
                utils.log("[createUser] Error creating the doc " + err);
                callback(err);
                return;
            }
            callback(undefined, success);
        });
    });
};

exports.deleteUser = function (email, callback) {
    User.findOneAndRemove({email: email}, function (err, success) {
        if (err) {
            utils.log("[deleteDoc] Error deleting the doc " + err);
            callback(err);
            return;
        }
        callback(undefined, success);
    });
};
