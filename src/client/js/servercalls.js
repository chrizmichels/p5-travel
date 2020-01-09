import ulog from "ulog";
import { isUrlValid, updateUI } from "./busnieslogic";

/* Global Variables */
let data = [];
let projectData = {};

//Setup Client Side Logging
const log = ulog("servercalls.js");
log.level = log.DEBUG;

/* Function called by event listener */
const getStarted = async event => {
  try {
    event.preventDefault();

    log.debug(
      "Client/servercalls.js/getStarted -> ::::: Get Results Clicked :::::"
    );
    //Get URL from UI
    let url = document.getElementById("name").value;

    log.debug("Client/servercalls.js/getStarted -> Get URL from UI: ", url);

    if (isUrlValid(url)) {
      //data.push(url);
      // console.log(url);
      projectData = {};
      projectData = { url: url };
      log.debug(
        "Client/servercalls.js/getStarted -> Call postData",
        projectData
      );

      //Send URL to /getSentiment Server enpoint
      //Return will be an json Object
      const data = await postData("/getSentiment", projectData);

      log.debug(
        "Client/servercalls.js/getStarted -> Data returned from postDAta Call:",
        data
      );

      //Update UI with result from server response
      updateUI(data);
    } else {
      alert("Please enter a valid URL");
    }
  } catch (err) {
    log.debug(
      "Client/servercalls.js/getStarted -> ERROR in Client Side - getStarted",
      error
    );
  }
};

/* Function to POST data */
const postData = async (url = "", data = {}) => {
  try {
    log.debug(
      `Client/servercalls.js/postData -> CALLED -> postData on URL: ${url}`
    );
    log.debug(`Client/servercalls.js/postData -> With Data Object -> `, data);

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
    log.debug(
      "Client/servercalls.js/postData ->  POST Data Route RESPONSE",
      newData
    );
    return newData;
  } catch (error) {
    log.debug(
      "Client/servercalls.js/postData -> ERROR in Client Side postData",
      error
    );
  }
};

// export { getStarted, postData, updateUI };
// export { getStarted };

export { isUrlValid, getStarted };
