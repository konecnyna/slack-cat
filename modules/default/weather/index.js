'use strict';

const DarkSky = require('dark-sky');
const util = require('util');
const GoogleGeocode = require('./google-geocode-api.js');
const geocoder = new GoogleGeocode();

const darksky = new DarkSky(secrets.getKey('darksky_api'));
const botParams = {
  icon_emoji: ':cat:',
  username: 'WeatherCat',
};

module.exports = class Weather extends BaseModule {

  async handle(data) {
    if (!secrets.getKey('darksky_api') || !secrets.getKey('google_geocode_api')) {
      this.bot.postMessage(data.channel, "Please put `darksky_api` or `google_geocode_api` key in secrets.dat");
      return;
    }

    let query = data.user_text;
    if (!query) {
      query = "nyc";
    }

    const coords = await geocoder.getLongLat(query);
    if (!coords) {
      this.bot.postMessage(data.channel, "No location found.");
      return;
    }

    darksky
      .latitude(coords.lat) // required: latitude, string || float.
      .longitude(coords.lng) // required: longitude, string || float.
      .exclude('minutely,daily') // optional: exclude, string || array, refer to API documentation.
      .extendHourly(true) // optional: extend, boolean, refer to API documentation.
      .get() // execute your get request.
      .then(weatherData => {
        this.sendFormattedWeather(data, weatherData, coords.name);
      })
      .catch(err => {
        console.error(err);
        this.bot.postMessageWithParams(data.channel, err, botParams);
      });
  }

  help() {
    return 'Usage: `?weather` gives current forecast for NYC';
  }

  sendFormattedWeather(data, weatherData, location) {
    var title = util.format(
      'Currently in %s: %d°',
      location,
      parseInt(weatherData.currently.apparentTemperature)
    );


    var summary = util.format(
      'Forecast: %s for the hour. %s\n\n %d%% humidity with wind speed of %d MPH',
      weatherData.currently.summary,
      weatherData.hourly.summary,
      parseInt(weatherData.currently.humidity * 100),
      weatherData.currently.windSpeed
    );

    this.bot.postFancyMessage(
      data.channel,
      ':new_moon_with_face:',
      '#ddd',
      title,
      summary,
      botParams
    );
  }
};
