const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const asyncHandler = require("express-async-handler");
const Geonames = require("geonames.js");
const Logic = require("./logic.js");

//Setup Logging
const getLogger = require("webpack-log");
const logger = getLogger({ name: "server-yoda", timestamp: true });

//Switch Log Level
// logger.level = "silent";
logger.level = "debug";

/* Setup Geonames  */
const geonames = new Geonames({
  username: "chrizmichels",
  lan: "de",
  encoding: "JSON"
});

/* Setup Dark Sky API */
const drkSkyAPIKey = process.env.API_ID

/* 
Aylien Setup Start
*/
const dotenv = require("dotenv");
dotenv.config();
const aylien = require("aylien_textapi");

// set aylien API credentias
let aylienResult = {};
var textapi = new aylien({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY
});

//Check if API Keys are readable
logger.debug(`Server/index.js -> Your API key is ${process.env.API_KEY}`);
logger.debug(`Server/index.js -> Aylien Text Api Object: `, textapi);
/*  
Aylien Setup End
*/

/* Geonames API Setup - START */
const geoUserName = process.env.GEO_USER;
let searchLocation = "";
let maxRows = 10;
/* Geonames API Setup - END */

// Setup empty JS object to act as endpoint for all routes
let projectData = {};
let data = [];

//Setup Express Server
const distPath = path.join(__dirname, "..//..//dist");
logger.debug(`Server/index.js -> DIST Folder Path: `, distPath);

const app = express();
app.use(cors());
// to use json
app.use(bodyParser.json());
// to use url encoded values
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//Set directory for production
app.use(express.static(distPath));

logger.debug(`Server/index.js -> Index.html Path: `, `${distPath}/index.html`);
app.get("/", function(req, res) {
  res.sendFile(`${distPath}/index.html`);
});

let port = 8081;
// let port = 3030;

// designates what port the app will listen to for incoming requests
app.listen(port, function() {
  logger.debug(`Server/index.js -> Example app listening on port ${port}!`);
});

// Post Route
app.post("/getLocation", async (req, res) => {
  data = [];
  data.push(req.body);
  logger.debug("/getLocation Endpoint -> POST received with: ", data);

  try {
    let locationToFind = data[0].location;
    logger.debug(
      "/getLocation Endpoint -> Server side POST - Call Geonames with:",
      locationToFind
    );
    const continents = await geonames.search({ q: locationToFind });
    /*  logger.debug(
      "/getLocation Endpoint -> Server side POST - Geonames RESPONSE:",
      continents
    ); */

    let cleanData = await Logic.cleanCountries(locationToFind, continents);
    logger.debug("/getLocation Endpoint -> Cleaned Location:", cleanData);
    res.json({
      cleanData
    });
  } catch (error) {
    logger.debug("/getLocation Endpoint -> ERROR in SERVER SIDE POST", error);
  }
});

//Get Weather Forecast



app.post("/getSentiment", async (req, res) => {
  data = [];
  data.push(req.body);
  logger.debug("/getSentiment Endpoint -> POST received with: ", data);

  try {
    let analyseURL = data[0].url;

    logger.debug(
      "/getSentiment Endpoint -> Server side POST - Call getSentiment with:",
      analyseURL
    );

    textapi.sentiment(
      {
        url: analyseURL
      },
      function(error, resp) {
        if (error === null) {
          // console.log(resp);
          logger.debug("/getSentiment Endpoint -> Aylien Response: ", resp);
          res.json({
            polarity: resp.polarity,
            confidence: resp.polarity_confidence,
            text: resp.text,
            url: analyseURL
          });
        } else {
          const failedText =
            "/getSentiment Endpoint -> Something went wrong fetching result from Aylien";
          logger.debug(failedText);
        }
      }
    );

    // res.send(aylienResult);
  } catch (error) {
    logger.debug("/getSentiment Endpoint -> ERROR in SERVER SIDE POST", error);
  }
});
