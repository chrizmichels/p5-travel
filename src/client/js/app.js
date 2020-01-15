/* Imports */
import ulog from "ulog";

import { getLocationInformation } from "./businesslogic";

//Setup Client Side Logging
// log.level = log.NONE;
const log = ulog("app.js");
log.level = log.DEBUG;

//Setup event Listener
// Event listener to add function to existing HTML DOM element
const el = document.getElementById("generate");
log.debug(`Client/app.js->  Add Event Listener to -> `, el);
el.addEventListener("click", getLocationInformation);
