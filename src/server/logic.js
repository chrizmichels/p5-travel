//Setup Logging
const getLogger = require("webpack-log");
const logger = getLogger({ name: "logic-yoda", timestamp: true });
const download2 = require("image-downloader");
const fs = require("fs");

//Switch Log Level
// logger.level = "silent";
logger.level = "debug";

module.exports.cleanCountries = async (date, match, data = {}) => {
  try {
    // let returnData = {};
    // logger.debug("Server/logic ->", data.geonames);
    findLocation(date, match, data).then(returnData => {
      logger.debug(
        `Server/logic/cleanCountries -> Location Return`,
        returnData
      );
      return returnData;
    });
  } catch (err) {
    logger.debug(`Server/logic/cleanCountries ERROR`, err);
  }
};

function findLocation(date, match, data) {
  try {
    let returnData = {};
    for (const el of data.geonames) {
      logger.debug("Server/findLocation Element Name ->", el.name);
      if (el.name === match) {
        logger.debug("Server/logic ->", el);
        return {
          name: el.name,
          lat: el.lat,
          lng: el.lng,
          date: date,
          country: el.countryName
        };
        logger.debug("Server/logic/RETURN ->", returnData);
        return returnData;
      }
    }
  } catch (error) {
    logger.debug(`Server/logic/findLocation ERROR`, error);
  }
}

module.exports.getDaysToTrip = (travelUnixTime, todayUnixTime) => {
  try {
    return Math.floor((unixTime - nowTime) / 3600 / 24) + 1;
  } catch (error) {
    logger.debug(`Server/logic/getDaysToTrip ERROR`, error);
  }
};

convertDateToUnixTime = date => {
  try {
    let dateSplit = date.split(".");
    let day = parseInt(dateSplit[0]);
    let month = parseInt(dateSplit[1]);
    let year = parseInt(dateSplit[2]);
    let hour = parseInt("00");
    let minute = parseInt("00");
    let second = parseInt("00");

    var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    logger.debug(`Server/logic/toTimeStamp -> DATE ${datum}`);

    return datum.getTime() / 1000;
  } catch (error) {
    logger.debug(`Server/logic/convertDateToUnixTime ERROR`, error);
  }
};

module.exports.toTimestamp = date => {
  try {
    const unixTime = convertDateToUnixTime(date);
    const nowTime = Math.floor(Date.now() / 1000);

    logger.debug(`Server/logic/toTimeStamp -> UNIX TIME ${unixTime}`);
    logger.debug(`Server/logic/toTimeStamp -> NOW TIME ${nowTime}`);
    logger.debug(
      `Server/logic/toTimeStamp -> Mlsc to Trip ${unixTime - nowTime}`
    );

    const daysToTrip = Math.floor((unixTime - nowTime) / 3600 / 24) + 1;

    logger.debug(`Server/logic/toTimeStamp -> Days to Trip ${daysToTrip}`);
    // gdaysToTrip = daysToTrip;

    return { unixTime: unixTime, daysToTrip: daysToTrip };
  } catch (error) {
    logger.debug(`Server/logic/toTimeStamp ERROR`, error);
  }
};

getFileNames = fromPath => {
  // destination.txt will be created or overwritten by default.
  try {
    const filenameArr = fromPath.split("/");
    const destFolder = "/dist/img";
    logger.debug(
      `Server/logic/cleanData/getFileNames -> Split URL:  `,
      filenameArr
    );

    filename = filenameArr[filenameArr.length - 1];
    logger.debug(
      `Server/logic/cleanData/getFileNames -> Filename:  `,
      filename
    );
    return `${destFolder}/${filename}`;
  } catch (error) {
    logger.debug(`Server/logic/copyFiles`, error);
  }
};

module.exports.copyFiles = async (From, To) => {
  logger.debug(`Server/logic/copyFiles from ${From} to ${To}`);

  try {
    if (fs.existsSync(From)) {
      await fs.copyFile(From, To, err => {
        if (err) {
          logger.debug(`Server/logic/copyFiles from ${From} to ${To}`);
          throw err;
        } else {
          return { copy: "OK" };
        }
      });
    } else {
      //return { copy: "Not OK" };
      throw `ERROR in Server/logic/copyFiles -> file ${From} does NOT exist`;
    }
  } catch (error) {
    logger.debug(`ERROR in Server/logic/copyFiles`, error);
  }
};

getHighLowTemp = hourlyData => {
  try {
    let minTemp = hourlyData[0].temperature;
    let maxTemp = hourlyData[0].temperature;

    for (const el of hourlyData) {
      //logger.debug(`Server/logic/getHighLowTemp`, el);

      if (el.temperature < minTemp) {
        minTemp = el.temperature;
      }
      if (el.temperature > maxTemp) {
        maxTemp = el.temperature;
      }
    }

    logger.debug(
      `Server/logic/getHighLowTemp -> MIN Temp: ${minTemp} // MAX Temp: ${maxTemp}`
    );
    return {
      minTemp: minTemp,
      maxTemp: maxTemp
    };
  } catch (error) {
    logger.debug(`ERROR in Server/logic/getHighLowTemp`, error);
  }
};

module.exports.cleanData = async data => {
  try {
    let cleanData = {};
    let imageUrl = "";
    let imageTags = "";
    let imageUrl2 = "";

    const minMaxTemp = getHighLowTemp(data[1].hourly.data);
    const unixTime = convertDateToUnixTime(data[0].cleanData.date);
    const nowTime = Math.floor(Date.now() / 1000);
    const daysToTrip = Math.floor((unixTime - nowTime) / 3600 / 24) + 1;

    if (data[2].totalHits > 0) {
      imageUrl = data[2].hits[0].webformatURL;
      imageTags = data[2].hits[0].tags;

      cleanData = {
        Location: data[0].cleanData.name,
        Latitude: data[0].cleanData.lat,
        Longitude: data[0].cleanData.lng,
        Date: data[0].cleanData.date,
        Country: data[0].cleanData.country,
        CurrentWthrSummary: data[1].currently.summary,
        HourlyWthrSummary: data[1].hourly.summary,
        minTemp: minMaxTemp.minTemp,
        maxTemp: minMaxTemp.maxTemp,
        ImageUrlTo: imageUrl,
        ImageUrlFrom: imageUrl,
        ImageTags: imageTags,
        DaysToTrip: daysToTrip
      };

      logger.debug(
        `Server/logic/cleanData -> JSON Object created:  `,
        cleanData
      );

      return cleanData;
    } else {
      imageUrl2 = "";
      imageTags = "";
      cleanData = {
        Location: data[0].cleanData.name,
        Latitude: data[0].cleanData.lat,
        Longitude: data[0].cleanData.lng,
        Date: data[0].cleanData.date,
        Country: data[0].cleanData.country,
        CurrentWthrSummary: data[1].currently.summary,
        HourlyWthrSummary: data[1].hourly.summary,
        minTemp: minMaxTemp.minTemp,
        maxTemp: minMaxTemp.maxTemp,
        ImageUrlTo: imageUrl,
        ImageUrlFrom: imageUrl,
        ImageTags: imageTags,
        DaysToTrip: daysToTrip
      };
      return cleanData;
    }
  } catch (error) {
    logger.debug(`Server/logic cleanData`, error);
  }
};

downloadImage = async url => {
  try {
    // Download to a directory and save with the original filename
    const options = {
      url: url,
      dest: "./src/client/media/" // "./src/client/media/" // Save to /path/to/dest/image.jpg
    };

    logger.debug(
      "Server/logic/downloadImage -> Trying to safe file to",
      options
    );

    async function downloadIMG() {
      try {
        const { filename, image } = await download2.image(options);
        logger.debug("Server/logic/downloadIMG -> File Saved to", filename);
        return filename;
      } catch (e) {
        logger.debug(
          "ERROR in Server/logic/downloadIMG -> while saving file",
          e
        );
      }
    }

    return downloadIMG().then(filename => {
      logger.debug("Server/logic/downloadIMG -> Return filename", filename);
      return filename;
    });
  } catch (error) {
    logger.debug(`Server/logic/downloadImage ERROR`, error);
  }
};
