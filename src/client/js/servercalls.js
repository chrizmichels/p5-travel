import ulog from "ulog";

//Setup Client Side Logging
const log = ulog("servercalls.js");
log.level = log.DEBUG;

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

export { postData };
