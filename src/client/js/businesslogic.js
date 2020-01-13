import ulog from "ulog";
import { postData } from "./servercalls";

/* Global Variables */
let data = [];
let projectData = {};

//Setup Client Side Logging
const log = ulog("busineslogic.js");
log.level = log.DEBUG;

let gData, gForecast, gPictures, gCleanData, gCopyData;

//Validate URL
function isUrlValid(userInput) {
  var res = userInput.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) return false;
  else return true;
}

function plg(data) {
  return {
    polarity: "resp.polarity",
    confidence: "resp.polarity_confidence",
    text: "resp.text",
    url: "analyseURL"
  };
}

/* Function called by event listener */
const getLocationCoordinates = async event => {
  try {
    event.preventDefault();

    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> ::::: Get Results Clicked :::::"
    );
    //Get URL from UI
    let location = document.getElementById("name").value;
    let date = document.getElementById("date").value;

    //If travel date is within a week -> Get Current Weather forecast
    //ELSE -> Get predicted forecast

    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> Get URL from UI: ",
      location
    );

    projectData = {};
    projectData = {
      location: location,
      date: date
    };
    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> Call postData",
      projectData
    );

    const data = await postData("/getLocation", projectData);

    log.debug(
      "Client/busineslogic.js/getLocation-> Data returned from postDAta Call:",
      data
    );

    const forecast = await postData("/getForecast", data);

    /*     log.debug(
      "Client/busineslogic.js/getForecast-> Data returned from postDAta Call:",
      forecast
    ); */

    const pictures = await postData("/getPictures", data);
    /* 
    log.debug(
      "Client/busineslogic.js/getPictures-> Data returned from postDAta Call:",
      pictures
    ); */

    let dataToClean = [];
    dataToClean.push(data);
    dataToClean.push(forecast);
    dataToClean.push(pictures);

    log.debug(
      "Client/busineslogic.js/getLocationCoordinates-> Data Object:",
      dataToClean
    );

    log.debug(
      "Client/busineslogic.js/getCleanData-> Data to Clean:",
      dataToClean
    );

    const cleanData = await postData("/getCleanData", dataToClean);

    log.debug(
      "Client/busineslogic.js/getCleanData-> Data returned from postDAta Call:",
      cleanData
    );

    const copyData = await postData("/copyImgFiles", cleanData);
    log.debug(
      "Client/busineslogic.js/copyImgData-> Data returned from postDAta Call:",
      copyData
    );

    await updateUILocation(cleanData);
  } catch (error) {
    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> ERROR in Client Side - getStarted",
      error
    );
  }
};

const updateUILocation = async data => {
  try {
    log.debug(
      `Client/busineslogic.js/updateUI ->  Update UI with data Object`,
      data
    );

    log.debug("Client/busineslogic.js/const updateUILocation", data);
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.Location
    );
    document.getElementById("location").innerHTML = `City: ${data.Location}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.Country
    );
    document.getElementById("country").innerHTML = `Country: ${data.Country}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.Latitude
    );
    document.getElementById("lat").innerHTML = `Latitude: ${data.Latitude}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.Longitude
    );
    document.getElementById("lng").innerHTML = `Longitude: ${data.Longitude}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.Date
    );
    document.getElementById("date").innerHTML = `Longitude: ${data.Date}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.CurrentWthrSummary
    );
    document.getElementById(
      "currentwthrsummary"
    ).innerHTML = `Current Weather: ${data.CurrentWthrSummary}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.HourlyWthrSummary
    );
    document.getElementById(
      "hourlywthrsummary"
    ).innerHTML = `Hourly Forecast: ${data.HourlyWthrSummary}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.minTemp
    );
    document.getElementById("minTemp").innerHTML = `Min Temp: ${data.minTemp}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.maxTemp
    );
    document.getElementById("maxTemp").innerHTML = `Max Temp: ${data.maxTemp}`;
    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.ImageTags
    );
    document.getElementById(
      "imagetags"
    ).innerHTML = `Image Tags: ${data.ImageTags}`;
    //

    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.ImageUrl
    );

    document.getElementById(
      "image"
    ).innerHTML = ` <img width="100%" height="auto" src="${data.ImageUrlTo}" alt="${data.ImageTags}"
  />`;
  } catch (error) {
    log.debug(
      "Client/busineslogic.js/updateUILocation -> ERROR in Client Side updateUILocation",
      error
    );
  }
};

const getStarted = async event => {
  try {
    event.preventDefault();

    log.debug(
      "Client/busineslogic.js/getStarted -> ::::: Get Results Clicked :::::"
    );
    //Get URL from UI
    let url = document.getElementById("name").value;

    log.debug("Client/busineslogic.js/getStarted -> Get URL from UI: ", url);

    if (isUrlValid(url)) {
      //data.push(url);
      // console.log(url);
      projectData = {};
      projectData = { url: url };
      log.debug(
        "Client/busineslogic.js/getStarted -> Call postData",
        projectData
      );

      //Send URL to /getSentiment Server enpoint
      //Return will be an json Object
      const data = await postData("/getSentiment", projectData);

      /* 
      log.debug(
        "Client/busineslogic.js/getLocation-> Data returned from postDAta Call:",
        data2
      ); 
 */
      //Update UI with result from server response
      updateUI(data);
    } else {
      alert("Please enter a valid URL");
    }
  } catch (err) {
    log.debug(
      "Client/busineslogic.js/getStarted -> ERROR in Client Side - getStarted",
      error
    );
  }
};

//Update UI
const updateUI = async data => {
  try {
    log.debug(
      `Client/busineslogic.js/updateUI ->  Update UI with data Object`,
      data
    );

    /*   const request = await fetch("/getSentiment");
      const allData = await request.json(); */
    const allData = data;

    log.debug("Client/busineslogic.js/updateUI -> Data: ", allData);
    document.getElementById("url").innerHTML = `URL: ${allData.url}`;
    document.getElementById("pol").innerHTML = `Polarity: ${allData.polarity}`;
    document.getElementById(
      "conf"
    ).innerHTML = `Confidence: ${allData.confidence}`;
    document.getElementById("restxt").innerHTML = `TEXT: ${allData.text}`;
  } catch (error) {
    log.debug(
      "Client/busineslogic.js/updateUI -> ERROR in Client Side updateUI",
      error
    );
  }
};

export { isUrlValid, updateUI, getStarted, plg, getLocationCoordinates };
