const cron = require('node-cron'),
    config = require('../config/config.js'),
    airportHttpClient = require('../http/airportHttpClient.js'),
    airlineHttpClient = require('../http/airlineHttpClient.js'),
    weatherHttpClient = require('../http/weatherHttpClient.js'),
    utils = require("../utils/utils.js");


exports.airportScheduler = cron.schedule(config.airportScheduleExpression, () => {
    utils.log('Running a job at '+new Date());
    airportHttpClient.airportHttpClient((err, success)=>{
        if(err){
            utils.log("Airport Scheduler - Error while getting the data from URL: "+config.airportUrl);
        }else{
            utils.log("Airport Scheduler - Successfully completed the scheduler. Uploaded the "+success.length+ " records to the DB");
        }
    });
});
exports.airlineScheduler = cron.schedule(config.airlineScheduleExpression, () => {
    utils.log('Running a job at '+new Date());
    airlineHttpClient.airlineHttpClient((err, success)=>{
        if(err){
            utils.log("Airline Scheduler - Error while getting the data from URL: "+config.airlineUrl);
        }else{
            utils.log("Airline Scheduler - Successfully completed the scheduler. Uploaded the "+success.length+ " records to the DB");
        }
    });
});

exports.weatherScheduler = cron.schedule(config.weatherScheduleExpression, () => {
   utils.log('Running a job of weather at ' + new Date());
   weatherHttpClient.updatePopularDocuments((err, success) => {
      if (err) {
          utils.log("Error update weather");
      } else {
          utils.log("Update Weather successfully");
      }
   });
});

// get popular cities info for weather api
exports.getCitiesForWeather = function () {
    utils.log('Getting cities info for weather');
    weatherHttpClient.initWeather((err, success) => {
       if (err) {
           utils.log("Weather - Error for getting the data from opencage");
       } else {
           utils.log("Weather - successfully completed the weather cities");
       }
    });
};