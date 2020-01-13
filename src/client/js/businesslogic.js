import ulog from "ulog";
import { postData } from "./servercalls";
/* 
const dotenv = require("dotenv");
dotenv.config(); */
/* import { dotenv } from "dotenv";
dotenv.config();
 */
/* Global Variables */
let projectData = {};

import L from "leaflet";
//Init Map
let mymap = L.map("mapid");

//Setup Client Side Logging
const log = ulog("busineslogic.js");
log.level = log.DEBUG;

//Validate URL
function isUrlValid(userInput) {
  var res = userInput.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) return false;
  else return true;
}

//Validate Date
function isDateValid(userInput) {
  var res = userInput.match(
    /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g
  );
  if (res == null) return false;
  else return true;
}

/* Function called by event listener */
const getLocationInformation = async event => {
  try {
    event.preventDefault();

    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> ::::: Get Results Clicked :::::"
    );
    //Get URL from UI
    let location = document.getElementById("name").value;
    let date = document.getElementById("date").value;

    log.debug(`MAP`, mymap);
    const MapBoxAPIKey =
      "pk.eyJ1IjoiY2hyaXptaWNoZWxzIiwiYSI6ImNrNWN4Z3lqbzF2Z2EzbXBnbXBicnd0aHUifQ.NmMvjb2FN_RWS1vEV4BYgg";
    // process.env.MAPBOX_API_KEY;
    mymap.setView([50.5, 30.5], 13);
    var marker = L.marker([50.5, 30.5]).addTo(mymap);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: MapBoxAPIKey
      }
    ).addTo(mymap);

    marker.bindPopup("<b>Let's go here!</b>").openPopup();

    // IF DAte is Valid
    if (location != "" && isDateValid(date)) {
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

      if (data.totalResultsCount === 0) {
        alert(`Location ${location} not found. Please try again`);
      } else {
        const forecast = await postData("/getForecast", data);

        log.debug(
          "Client/busineslogic.js/getForecast-> Data returned from postDAta Call:",
          forecast
        );

        const pictures = await postData("/getPictures", data);

        log.debug(
          "Client/busineslogic.js/getPictures-> Data returned from postDAta Call:",
          pictures
        );

        let dataToClean = [];
        dataToClean.push(data);
        dataToClean.push(forecast);
        dataToClean.push(pictures);

        log.debug(
          "Client/busineslogic.js/getCleanData-> Data to Clean:",
          dataToClean
        );

        const cleanData = await postData("/getCleanData", dataToClean);

        log.debug(
          "Client/busineslogic.js/getCleanData-> Data returned with CLEAN DATA:",
          cleanData
        );

        await updateUILocation(cleanData);
      }
    } else {
      if (location === "") {
        if (isDateValid(date)) {
          alert(`Check Location (${location}), Date (${date}) is fine!`);
        } else {
          alert(
            `Check Location (${location}) and Date (${date}), bothe have problems!`
          );
        }
      } else {
        if (!isDateValid(date)) {
          alert(`Check Date (${date}), Location (${location}) is fine!`);
        }
      }
    }
  } catch (error) {
    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> ERROR in Client Side - getStarted",
      error
    );
  }
};

//Update UI with all data
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
      data.DaysToTrip
    );
    document.getElementById(
      "daystoTrip"
    ).innerHTML = `Days to Trip: ${data.DaysToTrip}`;
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

export { isUrlValid, getLocationInformation };
