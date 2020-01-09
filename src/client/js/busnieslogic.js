import ulog from "ulog";

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

export { isUrlValid, updateUI, plg };
