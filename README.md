# About

This Repo is part of a excercise for the Frontend Developer Udacity Nanodegree. It implements a Travel App which gives you a weather forecast from [DarkSky API](https://darksky.net/). Enter Location name and Date and you will get back the weather forecast and a nice picture. Give it a shot.

## Getting started

1. Fork this repo and clone it down to your machine.

`cd` into your new folder and run:

2. `npm install`

To make all this work, you need to get your own API Keys.

3. Signup for an API keys

Get your Keys form the following services:

- [Geonames](https://www.geonames.org/) to get LAT/LON coordinates for your location
- [Dark Sky](https://darksky.net/) to get the Weather forecast (eats LAT/LON)
- [Pixbay](https://pixabay.com/) to get some nice pictures
- [MapBox](https://account.mapbox.com/auth/signin/?route-to=%22/access-tokens/%22) to get some Geo Data for [Leaflet](https://leafletjs.com/) Mapping container

Signing up will get yu an API key. Don't worry the API is free to use up to 1000 requests per day or 333 intensive requests. It is free to check how many requests you have remaining for the day.

4. Hide your Key using a .env file

- [ ] Use npm or yarn to install the dotenv package `npm install dotenv`. This will allow us to use environment variables we set in a new file
- [ ] Create a new `.env` file in the root of your project
- [ ] Go to your .gitignore file and add `.env` - this will make sure that we don't push our environment variables to Github! If you forget this step, all of the work we did to protect our API keys was pointless.
- [ ] Fill the .env file with your API keys like this:

```
GEO_USER=**************************
SKY_API_KEY=**************************
PIXBAY_API_KEY=**************************
MAPBOX_API_KEY=**************************
```

5. Logging
   To get a better trace for debugging I am using a logger you can swith on/off.
   Client Side:  
   Log on -> `log.level = log.DEBUG;`  
   Log off -> `log.level = log.NONE;`  
   Server Side  
   Log on -> `logger.level = "silent";`  
   Log off -> `logger.level = "debug";`

6) have fun :octopus:
