/*globals require, process */
/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const express = require("express"),
    app = express(),
    collection = require("./utils/collection"),
    bodyParser = require("body-parser"),
    jwtMiddleware = require("./utils/middleware.js"),
    userRouter = express.Router(),
    user = require("./route/userRouter.js");


const expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: 'Swagger doc for CMS',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'ec2-54-68-100-10.us-west-2.compute.amazonaws.com:5000',
        // host: 'localhost:5000',
        basePath: '/',
        produces: [
            "application/json" //,"application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./route/**.js', './models/**.js'] //Path to the API handle folder
};
expressSwagger(options);

// Body-parser (To parse the request body)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
    Add to avoid cross origin access.
    Access-Control-Allow-Origin is set to '*' so that server REST APIs are accessible for all the domains.
    By setting domain name to some value, the API access can be restricted to only the mentioned domain.
    Eg, Access-Control-Allow-Origin: 'mywebsite.com'
*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, 'Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    next();
});

// Set the port no
app.set("port", process.env.PORT || 5000);
app.set(process.env.DEFAULT_LOCALE, '');


userRouter.get("/", user.getUsers);
userRouter.get("/:email", user.getUser);
userRouter.put("/", user.updateUser);
userRouter.post("/", user.updateUser);
userRouter.delete("/", user.deleteUser);

app.use("/user", userRouter);

// Start the service
app.listen(app.get("port"));

console.log("Sample node server Started @ " + new Date() + " Running on port no: " + app.get("port"));