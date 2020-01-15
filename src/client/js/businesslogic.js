import ulog from "ulog";
import { postData } from "./servercalls";

/* Global Variables */
let projectData = {};

//Setup LOgging
//Setup Client Side Logging

const log = ulog("busineslogic.js");
// log.level = log.DEBUG;
log.level = log.NONE;

//Init Map
import L from "leaflet";
let mymap = L.map("mapid", {
  // center: new L.LatLng(48.8534, 2.3486),
  zoom: 8,
  minZoom: 5,
  maxZoom: 13,
  loadingControl: true
});

async function drawMap(mymap, Lat, Lon, LocationName) {
  try {
    const request = await fetch("/getMapBoxAPIKey");
    const keyData = await request.json();
    let MapBoxAPIKey = keyData.key;

    log.debug(
      "Client/busineslogic.js/getMapBoxAPIKey -> MapBoyKey",
      MapBoxAPIKey
    );

    mymap.setView([Lat, Lon], 13);
    var marker = L.marker([Lat, Lon]).addTo(mymap);

    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MapBoxAPIKey}`,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: MapBoxAPIKey
      }
    ).addTo(mymap);

    let latLngs = [marker.getLatLng()];
    let markerBounds = L.latLngBounds(latLngs);
    mymap.fitBounds(markerBounds);

    marker.bindPopup(`<b>Let's go to ${LocationName}</b>`).openPopup();
  } catch (error) {
    log.debug(
      "Client/busineslogic.js/drawMap -> ERROR in Client Side - getStarted",
      error
    );
  }
}

drawMap(mymap, 48.8534, 2.3486, "Paris");

//Validate URL
function isUrlValid(userInput) {
  var res = userInput.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) return false;
  else return true;
}

//Validate Date24, 121)24, 121)24, 121)24, 121)
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

      if (data.totalResultsCount === 0 || data == undefined) {
        alert(`Location ${location} not found. Please try again`);
      } else {
        //Add Location to Map
        let Lat = data.cleanData.lat;
        let Lon = data.cleanData.lng;

        /// CREATE MAP

        drawMap(mymap, Lat, Lon, location);

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

        // await updateUILocation(cleanData);
        travelCard(cleanData);
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

const travelCard = data => {
  try {
    let weatherSummary = "";

    if (data.CurrentWthrSummary == undefined) {
      weatherSummary = `<h2>Your request is to far in the future, there is no weather summary yet. Check Temperature below.</h2>`;
    } else {
      weatherSummary = `<h2>Weather Summary: ${data.HourlyWthrSummary} </h2>`;
    }

    const html = `
    <div id="trip">
        <h1> Your travel is ${data.DaysToTrip} days away</h1>
        <h2>Time to get ready. Here some impressions:</h2>
        <img  src="${data.ImageUrlTo}" alt="${data.ImageTags}"/>
        <h2>You are traveling to ${data.Location} in ${data.Country}, expect the following weather: </h2>
        ${weatherSummary}
        <h2>Temperature High: ${data.maxTemp} celsius</h2>
        <h2>Temperature Low: ${data.minTemp} celsius</h2>
    </div>
    `;

    //
    log.debug(
      "Client/busineslogic.js/const updateUILocation -> set ",
      data.Country
    );
    document.getElementById("card").innerHTML = html;
    //
  } catch {
    log.debug(
      "Client/busineslogic.js/travelCard -> ERROR in Client Side - getStarted",
      error
    );
  }
};

export { isUrlValid, getLocationInformation };
