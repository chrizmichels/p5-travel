import ulog from "ulog";
import { postData } from "./servercalls";

/* Global Variables */
let data = [];
let projectData = {};

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

    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> Get URL from UI: ",
      location
    );

    projectData = {};
    projectData = { location: location };
    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> Call postData",
      projectData
    );

    const data = await postData("/getLocation", projectData);

    log.debug(
      "Client/busineslogic.js/getLocation-> Data returned from postDAta Call:",
      data
    );

    await updateUILocation(data);
  } catch (error) {
    log.debug(
      "Client/busineslogic.js/getLocationCoordinates -> ERROR in Client Side - getStarted",
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

      /*     log.debug(
        "Client/busineslogic.js/getStarted -> Data returned from postDAta Call:",
        data
      ); */

      /*       const data2 = await postData("/getLocation", {
        location: "Kerpen (Eifel)"
      });

      log.debug(
        "Client/busineslogic.js/getLocation-> Data returned from postDAta Call:",
        data2
      ); */

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

const updateUILocation = async data => {
  try {
    log.debug(
      `Client/busineslogic.js/updateUI ->  Update UI with data Object`,
      data
    );

    /*   const request = await fetch("/getSentiment");
      const allData = await request.json(); */
    // const allData = data;

    log.debug("Client/busineslogic.js/const updateUILocation", data);
    document.getElementById(
      "location"
    ).innerHTML = `Name: ${data.cleanData.name}`;
    document.getElementById(
      "lat"
    ).innerHTML = `Latitude: ${data.cleanData.lat}`;
    document.getElementById(
      "lng"
    ).innerHTML = `Longitude: ${data.cleanData.lng}`;
  } catch (error) {
    log.debug(
      "Client/busineslogic.js/updateUILocation -> ERROR in Client Side updateUILocation",
      error
    );
  }
};

export { isUrlValid, updateUI, getStarted, plg, getLocationCoordinates };
