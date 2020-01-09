/* Imports */
import ulog from "ulog";

import { isUrlValid } from "./helper";

/* Global Variables */
let data = [];
let projectData = {};

//Setup Client Side Logging
const log = ulog("app.js");
// log.level = log.DEBUG;
log.level = log.NONE;

/* Function called by event listener */
const getStarted = async event => {
  try {
    event.preventDefault();

    log.debug("Client/app.js/getStarted -> ::::: Get Results Clicked :::::");
    //Get URL from UI
    let url = document.getElementById("name").value;

    log.debug("Client/app.js/getStarted -> Get URL from UI: ", url);

    if (isUrlValid(url)) {
      //data.push(url);
      // console.log(url);
      projectData = {};
      projectData = { url: url };
      log.debug("Client/app.js/getStarted -> Call postData", projectData);

      //Send URL to /getSentiment Server enpoint
      //Return will be an json Object
      const data = await postData("/getSentiment", projectData);

      log.debug(
        "Client/app.js/getStarted -> Data returned from postDAta Call:",
        data
      );

      //Update UI with result from server response
      updateUI(data);
    } else {
      alert("Please enter a valid URL");
    }
  } catch (err) {
    log.debug(
      "Client/app.js/getStarted -> ERROR in Client Side - getStarted",
      error
    );
  }
};

/* // Event listener to add function to existing HTML DOM element
const el = document.getElementById("generate");
log.debug(`Add Event Listener to -> `, el);
el.addEventListener("click", getStarted); */

/* Function to POST data */
const postData = async (url = "", data = {}) => {
  try {
    log.debug(`Client/app.js/postData -> CALLED -> postData on URL: ${url}`);
    log.debug(`Client/app.js/postData -> With Data Object -> `, data);

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json" //"Content-Type"
      },
      // Body data type must match "Content-Type" header
      body: JSON.stringify(data)
    });

    const newData = await response.json();
    log.debug("Client/app.js/postData ->  POST Data Route RESPONSE", newData);
    return newData;
  } catch (error) {
    log.debug("Client/app.js/postData -> ERROR in Client Side postData", error);
  }
};

//Update UI
const updateUI = async data => {
  try {
    log.debug(`Client/app.js/updateUI ->  Update UI with data Object`, data);

    /*   const request = await fetch("/getSentiment");
    const allData = await request.json(); */
    const allData = data;

    log.debug("Client/app.js/updateUI -> Data: ", allData);
    document.getElementById("url").innerHTML = `URL: ${allData.url}`;
    document.getElementById("pol").innerHTML = `Polarity: ${allData.polarity}`;
    document.getElementById(
      "conf"
    ).innerHTML = `Confidence: ${allData.confidence}`;
    document.getElementById("restxt").innerHTML = `TEXT: ${allData.text}`;
  } catch (error) {
    log.debug("Client/app.js/updateUI -> ERROR in Client Side updateUI", error);
  }
};

export { getStarted, postData, updateUI };
