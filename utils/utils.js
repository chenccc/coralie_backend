/*globals module */
/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

/*
	All the utility functions will be defined within this module
*/
const mongoose = require("mongoose"),
    collection = require("../utils/collection"),
    config = require("../config/config.js");

let Utils = function () {
    let log, locales, connectToDb;
    /*module.export(let Waiting_for_shipment = 1,
        Waiting_for_delivery = 2,
        Delivered=3,
        Waiting_for_return = 4,
        Returned = 5,
        Cancelled = 6,
        available=7);*/

    // Function to print logs on console
    log = function (message) {
        console.log(new Date()+" : "+message);
    };
    locales = [
        "en",
        "zhHK",
        "zhCN",
        "fr",
        "ja",
        "ar",
        "es",
        "de",
        "ko",
        "ru",
        "pt",
        "tr",
        "my"
    ];

    // Function to establish connection for the Database
    connectToDb = function (callback) {
        // If the connection is already established, Then don't create one more connection
        if (mongoose.connection.readyState) {
            callback(undefined, {msg: "connected", code: 200});
            return;
        }
        // Establish the DB connection
        // let uri = "mongodb://" +
        //     encodeURIComponent(config.userName) +
        //     ":" + encodeURIComponent(config.password) +
        //     "@localhost:27017/CMS?authSource=admin";

        let uri = "mongodb://localhost:27017/CMS?authSource=admin";

        mongoose.connect(uri);

        // Event for successfully connecting database
        mongoose.connection.on("connected", function () {
            callback(undefined, {msg: "connected", code: 200});
        });
        // Event when there is an error connecting for database
        mongoose.connection.on("error", function (err) {
            log("[connectToDb] Error connecting to DB " + err);
            callback(err);
        });
        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                console.log('Mongoose disconnected through app termination');
                process.exit(0);
            });
        });

    };

    // Function to return subTable for category attribute
    getSubTable = function (currentTable, type) {
        var subTable = "";
        switch (currentTable) {
            case collection.CATEGORY:
                subTable = collection.PREFIX + collection.SECTION;
                break;
            case collection.SECTION:
                switch (type) {
                    case collection.INFORMATION_TYPE:
                        subTable = collection.PREFIX + collection.INFO_ARTICLE;
                        break;
                    case collection.JOGGING_MAP_TYPE:
                        subTable = collection.PREFIX + collection.JOGGING_MAP_ARTICLE;
                        break;
                    case collection.INFORMATION_WITH_SUB_MENU_TYPE:
                        subTable = collection.PREFIX + collection.INFO_SUB_MENU_SECTION;
                        break;
                    case collection.IN_ROOM_DINING_TYPE:
                        subTable = collection.PREFIX + collection.IN_ROOM_DINING_SECTION;
                        break;
                    case collection.IN_ROOM_DINING_OPTIONSETS_TYPE:
                        subTable = collection.PREFIX + collection.IN_ROOM_DINING_OPTIONSET;
                        break;
                    case collection.HOTEL_DINING_TYPE:
                        subTable = collection.PREFIX + collection.HOTEL_DINING_SECTION;
                        break;
                    case collection.EARTH_TV_TYPE:
                        subTable = collection.PREFIX + collection.EARTH_TV_ARTICLE;
                        break;
                    case collection.THE_PENINSULA_SPA_TYPE:
                        subTable = collection.PREFIX + collection.THE_PENINSULA_SPA_ARTICLE;
                        break;
                    case collection.SPA_TREATMENTS_TYPE:
                        subTable = collection.PREFIX + collection.SPA_TREATMENTS_SECTION;
                        break;
                    case collection.TV_TYPE:
                        subTable = collection.PREFIX + collection.TV_ARTICLE;
                        break;
                    case collection.RADIO_TYPE:
                        subTable = collection.PREFIX + collection.RADIO_ARTICLE;
                        break;
                    case collection.MULTIMEDIA_CONNECTION_TYPE:
                        subTable = collection.PREFIX + collection.MULTIMEDIA_CONNECTION_ARTICLE;
                        break;
                    case collection.GUEST_REQUEST_TYPE:
                        subTable = collection.PREFIX + collection.GUEST_REQUEST_SECTION;
                        break;
                }
                break;
            case collection.INFO_SUB_MENU_SECTION:
                subTable = collection.PREFIX + collection.INFO_SUB_MENU_ARTICLE;
                break;
            case collection.IN_ROOM_DINING_SECTION:
                subTable = collection.PREFIX + collection.IN_ROOM_DINING_ARTICLE;
                break;
            case collection.IN_ROOM_DINING_ARTICLE:
                subTable = collection.PREFIX + collection.IN_ROOM_DINING_ITEM;
                break;
            case collection.IN_ROOM_DINING_OPTIONSET:
                subTable = collection.PREFIX + collection.CHOICE;
                break;
            case collection.HOTEL_DINING_SECTION:
                subTable = collection.PREFIX + collection.HOTEL_DINING_ARTICLE;
                break;
            case collection.SPA_TREATMENTS_SECTION:
                subTable = collection.PREFIX + collection.SPA_TREATMENTS_ARTICLE;
                break;
            case collection.GUEST_REQUEST_SECTION:
                subTable = collection.PREFIX + collection.GUEST_REQUEST_SERVICE;
                break;
            case collection.THE_PENINSULA_SPA_ARTICLE:
                if (type === collection.SPA_TREATMENTS_TYPE) {
                    subTable = collection.PREFIX + collection.SPA_TREATMENTS_SECTION;
                }
                break;
        }
        return subTable;
    };

    return {
        log: log, locales: locales, connectToDb: connectToDb, getSubTable: getSubTable
    };
};


module.exports = new Utils();