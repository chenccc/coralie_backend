/*globals exports, require */

const utils = require("../utils/utils.js"),
    connection = require("../dao/userConnection.js");

/**
 * API for Get all users.
 * @route GET /user
 * @group user
 * @param {string} pageNum.query - Optional - for pagination
 * @param {string} records.query - Optional - for pagination
 * @returns {object} 200 - An array of user info
 * @returns {Error}  500 default - Unexpected error
 */
exports.getUsers = function (req, res) {
    let pageNum = 0, noOfRecords = 0;
    if (req.query && req.query.pageNum && req.query.records) {
        pageNum = parseInt(req.query.pageNum);
        noOfRecords = parseInt(req.query.records);
    }
    // To check if the connection is available / To establish the Database connection
    connection.connectToDb(function (error) {
        if (error) {
            return res.status(500).json({user: "Error connecting to db", status: error});
        }
        // To get the information of a User
        connection.getUsers(pageNum, noOfRecords, function (err, success) {
            if (err) {
                res.status(500).json({user: "Error retrieving the info", status: err});
                return;
            }
            res.status(200).json({user: success});
        });
    });
};

/**
 * API for Get user details.
 * @route GET /user/{email}
 * @group user
 * @param {string} email.path.required - user@domain
 * @returns {object} 200 - user info for the email provided
 * @returns {Error}  500 default - Unexpected error
 */
exports.getUser = function (req, res) {
    const email = req.params.email;
    // To check if the connection is available / To establish the Database connection
    connection.connectToDb(function (error) {
        if (error) {
            return res.status(500).json({user: "Error connecting to db", status: error});
        }
        // To get the information of a User
        connection.getUser(email, function (err, success) {
            if (err) {
                res.status(500).json({user: "Error retrieving the info", status: err});
                return;
            }
            res.status(200).json({user: success});
        });
    });
};

/**
 * API for create user
 * @route POST /user
 * @group user
 * @param {User.model} User.body.required
 * @returns {object} 200 - user info
 * @returns {Error}  500 default - Unexpected error
 */
/**
 * API for update user
 * @route PUT /user
 * @group user
 * @param {User.model} User.body.required
 * @returns {object} 200 - user info
 * @returns {Error}  500 default - Unexpected error
 */
exports.updateUser = function (req, res) {
    let body = req.body;
    utils.log("[updateUser] Request received to create / update the information of a user " + body);
    if (!body) {
        res.status(400).json({user: "Missing request Body", status: "BAD_REQUEST"});
        return;
    }
    // To check if the connection is available / To establish the Database connection
    connection.connectToDb(function (error) {
        if (error) {
            res.status(500).json({"msg": "Error connecting to db", status: error});
            return;
        }
        // If the DB is connected then Create / Update the doc
        connection.createUser(body, function (err, success) {
            if (err) {
                res.status(500).json({"msg": "error updating info", status: err});
                return;
            }
            res.status(200).json({user: success});
        });
    });
};

/**
 * API for DELETE users.
 * @route DELETE /user
 * @group user
 * @param {User.model} User.body.required
 * @returns {object} 200 - User info
 * @returns {Error}  500 default - Unexpected error
 */
exports.deleteUser = function (req, res) {
    let body = req.body;
    let user = body.email;
    utils.log("[deleteUser] Request received to delete the information of a user " + user);
    if (!user) {
        res.status(400).json({user: "Missing required parameter :: email", status: "BAD_REQUEST"});
        return;
    }
    // To check if the connection is available / To establish the Database connection
    connection.connectToDb(function (error) {
        if (error) {
            return res.status(500).json({user: "Error connecting to db", status: error});
        }
        // To get the information of a User
        connection.deleteUser(user, function (err, success) {
            if (err) {
                res.status(500).json({user: "Error retrieving the info", status: err});
                return;
            }
            res.status(200).json({user: success});
        });
    });
};