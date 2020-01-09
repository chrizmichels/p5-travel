/* Imports */
import ulog from "ulog";
import { getStarted, getLocationCoordinates } from "./businesslogic";

/* Global Variables */
let data = [];
let projectData = {};

//Setup Client Side Logging
const log = ulog("app.js");
log.level = log.DEBUG;
// log.level = log.NONE;

//Setup event Listener
// Event listener to add function to existing HTML DOM element
const el = document.getElementById("generate");
log.debug(`Client/app.js->  Add Event Listener to -> `, el);
el.addEventListener("click", getLocationCoordinates);
