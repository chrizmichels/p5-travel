const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const asyncHandler = require("express-async-handler");
const Geonames = require("geonames.js");
const Logic = require("./logic.js");
const fetch = require("node-fetch");
const axios = require("axios");
const { parse, stringify } = require("flatted/cjs");
const download2 = require("image-downloader");
const gTimeToTrip = "";

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

/* Setup Dark Sky API */
const drkSkyAPIKey = process.env.SKY_API_KEY;
logger.debug(`Server/index.js -> Your Dark Sky API key is ${drkSkyAPIKey}`);

let drkSkyLat = "42.3601";
let drkSkyLon = "-71.0589";
let drkSkyURL = `https://api.darksky.net/forecast/${drkSkyAPIKey}/${drkSkyLat},${drkSkyLon}`;

//Setup PixBay API - PIXBAY_API_KEY
const pxbayAPIKey = process.env.PIXBAY_API_KEY;
logger.debug(`Server/index.js -> Your PixBay API key is ${pxbayAPIKey}`);

let pxbaySearch = "";
let pxbayURL = `https://pixabay.com/api/?key=${pxbayAPIKey}&q=${pxbaySearch}&image_type=photo`;

//Check if API Keys are readable
// logger.debug(`Server/index.js -> Your API key is ${process.env.API_KEY}`);
// logger.debug(`Server/index.js -> Aylien Text Api Object: `, textapi);
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

let port = 8085;
// let port = 3030;

// designates what port the app will listen to for incoming requests
app.listen(port, function() {
  logger.debug(`Server/index.js -> Example app listening on port ${port}!`);
});

// Callback function to complete GET '/all'
app.get("/getDaysToTrip", (req, res) => {
  try {
    logger.debug("Server/getDaysToTrip Endpoint -> Get request: ", req);
    res.send(gTimeToTrip);
  } catch (error) {
    logger.debug(`ERROR Server/getDaysToTrip Endpoint -> Get reques`);
  }
});

app.get("/getMapBoxAPIKey", async (req, res) => {
  try {
    logger.debug("Server/getMapBoxAPIKey Endpoint -> Get request: ", req);
    let value = { key: process.env.MAPBOX_API_KEY }; //res.json({ key: process.env.MAPBOX_API_KEY });
    res.send(value);
  } catch (error) {
    logger.debug(`ERROR Server/getMapBoxAPIKey Endpoint -> Get request`, error);
  }
});

// Post Route
app.post("/getLocation", async (req, res) => {
  data = [];
  data.push(req.body);
  logger.debug("/getLocation Endpoint -> POST received with: ", data);

  try {
    let locationToFind = data[0].location;
    let date = data[0].date;
    logger.debug(
      "/getLocation Endpoint -> Server side POST - Call Geonames with:",
      locationToFind
    );

    const continents = await geonames.search({ q: locationToFind });
    /*     logger.debug(
      "/getLocation Endpoint -> Server side POST - Geonames RESPONSE:",
      continents
    ); */

    //Check if continents are not empty
    if (continents.totalResultsCount > 0) {
      let cleanData = await Logic.cleanCountries(
        date,
        locationToFind,
        continents
      );
      logger.debug("/getLocation Endpoint -> Cleaned Location:", cleanData);
      res.json({
        cleanData
      });
    } else {
      // alert(`Location ${locationToFind} not Found, please try again$`);
      res.json(continents);
      logger.debug(
        `/getLocation Endpoint -> Location ${locationToFind} not found`
      );
    }
  } catch (error) {
    logger.debug("/getLocation Endpoint -> ERROR in SERVER SIDE POST", error);
  }
});

//Get Weather Forecast
app.post("/getForecast", async (req, res) => {
  data = [];
  data.push(req.body);
  logger.debug("getForecast Endpoint -> POST received with: ", data);

  try {
    drkSkyLat = data[0].cleanData.lat;
    drkSkyLon = data[0].cleanData.lng;
    let date = `${data[0].cleanData.date}`; // 00:00:00 GMT`;
    let unixTime = Logic.toTimestamp(date);
    logger.debug("getForecast Endpoint -> unixTime: ", unixTime.unixTime);

    let drkSkyURL = `https://api.darksky.net/forecast/${drkSkyAPIKey}/${drkSkyLat},${drkSkyLon},${unixTime.unixTime}?lang=de&units=si#`;

    logger.debug(
      "getForecast Endpoint -> Server side POST - fetch url: ",
      drkSkyURL
    );

    fetch(drkSkyURL)
      .then(res => res.json())
      .then(json => res.json(json));
  } catch (error) {
    logger.debug(
      "Server/getForecast Endpoint -> ERROR in SERVER SIDE POST",
      error
    );
  }
});

//Get Pictures
app.post("/getPictures", async (req, res) => {
  data = [];
  data.push(req.body);
  logger.debug("getPictures Endpoint -> POST received with: ", data);

  try {
    pxbaySearch = `${encodeURIComponent(
      data[0].cleanData.name
    )}+${encodeURIComponent(data[0].cleanData.country)}`;

    let pxbaySearchCountry = `${encodeURIComponent(data[0].cleanData.country)}`;

    logger.debug("getPictures Endpoint -> Server side POST - req body: ", data);

    let pxbayURL = `https://pixabay.com/api/?key=${pxbayAPIKey}&q=${pxbaySearch}&image_type=photo&lang=de&category=buildings`;

    let pxbayURLCountry = `https://pixabay.com/api/?key=${pxbayAPIKey}&q=${pxbaySearchCountry}&image_type=photo&lang=de&category=buildings`;
    logger.debug(
      "getPictures Endpoint -> Server side POST - fetch url: ",
      pxbayURL
    );

    fetch(pxbayURL)
      .then(res => res.json())
      .then(json => {
        logger.debug("getPictures Endpoint -> POST received with: ", json);
        if (json.total === 0) {
          fetch(pxbayURLCountry)
            .then(res => res.json())
            .then(json => {
              res.json(json);
            });
        } else {
          res.json(json);
        }
      });
  } catch (error) {
    logger.debug("getPictures Endpoint -> ERROR in SERVER SIDE POST", error);
  }
});

//Clean Data and return JSON Object
app.post("/getCleanData", async (req, res) => {
  let data;
  data = req.body;
  logger.debug("getCleanData Endpoint -> POST received with: ", data);

  try {
    const cleanData = await Logic.cleanData(data);
    logger.debug(
      "getCleanData Endpoint -> Data returned from Cleaning: ",
      cleanData
    );

    res.json(cleanData);
  } catch (error) {
    logger.debug("getCleanData Endpoint -> ERROR in SERVER SIDE POST", error);
  }
});

app.post("/copyImgFiles", async (req, res) => {
  try {
    let data;
    data = req.body;
    logger.debug("copyImgFiles Endpoint -> POST received with: ", data);
    logger.debug(
      `copyImgFiles Endpoint -> From ${data.ImageUrlFrom} To ${data.ImageUrlTo}`
    );
    const response = await Logic.copyFiles(data.ImageUrlFrom, data.ImageUrlTo);
    logger.debug(
      "copyImgFiles Endpoint -> Data returned from copy: ",
      response
    );

    res.json(response);
  } catch (error) {
    logger.debug("getCleanData Endpoint -> ERROR in SERVER SIDE POST", error);
  }
});

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
