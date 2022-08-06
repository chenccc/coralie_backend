const mqtt = require('mqtt'),
      config = require('../config/config.js'),
      utils = require("../utils/utils.js");

exports.publish = function(topic, message) {
    let client = mqtt.connect(config.brokerURL, {
        username: config.mqttUsername, password: config.mqttPassword,
        keepalive: 3600,
    });

    client.on('connect', function () {
        /*client.subscribe(topic, function (err) {
            if (!err) {
                utils.log("Subscribed to "+topic);
            }
        });*/
        client.publish(topic, message, {qos: 2});
        utils.log("Published data to MQTT for topic: "+topic);
    });

    client.on('message', function (topic, message) {
        // message is Buffer
        utils.log(message.byteLength);
        client.end();
    });
};