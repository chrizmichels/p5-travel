const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const asyncHandler = require("express-async-handler");
//Setup Logging
const getLogger = require("webpack-log");
const logger = getLogger({ name: "wbpck-yoda", timestamp: true });

//Switch Log Level
// logger.level = "silent";
logger.level = "debug";

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


/* Geonames API Setup - START






Geonames API Setup - END */



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
