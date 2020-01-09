# About

This Repo is part of a excercise for the Frontend Developer Udacity Nanodegree. It implements NPL capabilities of the News Inteligence Platform Aylien('https://aylien.com/').
Paste a URL into the form an hit submit. Aylien will analyse the sentiment of the page and return a score.

## Getting started

1. Fork this repo and clone it down to your machine.

`cd` into your new folder and run:

2. `npm install`

To get access to Alyen, you need to get your ur own API Keys and install te API:

3. Signup for an API key

Go to [here](https://developer.aylien.com/signup). Signing up will get yu an API key. Don't worry the API is free to use up to 1000 requests per day or 333 intensive requests. It is free to check how many requests you have remaining for the day.

4. Hide your Key using a .env file

- [ ] Use npm or yarn to install the dotenv package `npm install dotenv`. This will allow us to use environment variables we set in a new file
- [ ] Create a new `.env` file in the root of your project
- [ ] Go to your .gitignore file and add `.env` - this will make sure that we don't push our environment variables to Github! If you forget this step, all of the work we did to protect our API keys was pointless.
- [ ] Fill the .env file with your API keys like this:

```
API_ID=**************************
API_KEY=**************************
```

5. have fun :octopus:
