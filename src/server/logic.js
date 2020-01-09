//Setup Logging
const getLogger = require("webpack-log");
const logger = getLogger({ name: "logic-yoda", timestamp: true });

//Switch Log Level
// logger.level = "silent";
logger.level = "debug";

//Return Data Object
let cleanData = {};

module.exports.cleanCountries = async (match, data = {}) => {
  try {
    // logger.debug("Server/logic ->", data.geonames);
    for (const el of data.geonames) {
      if (el.name === match) {
        // logger.debug("Server/logic ->", el);
        return {
          name: el.name,
          lat: el.lat,
          lng: el.lng
        };
      }
    }
    logger.debug("Server/logic/RETURN ->", cleanData);
    // return cleanData;
  } catch (err) {
    logger.debug(`Server/logic ERROR`, err);
  }
};
