'use strict';

const DarkSky = require('dark-sky');
const util = require('util');

const darksky = new DarkSky(process.env.DARK_SKIES_API_KEY);
const botParams = {
  icon_emoji: ':cat:',
  username: 'WeatherCat',
};

module.exports = class Weather extends BaseModule {

  handle(data) {
    if (!process.env.DARK_SKIES_API_KEY) {
      this.bot.postMessage(data.channel, "Please put `darksky_api` key in secrets.dat");
      return;
    }

    
    darksky
      .latitude(40.7831) // required: latitude, string || float.
      .longitude(-73.9712) // required: longitude, string || float.
      .exclude('minutely,daily') // optional: exclude, string || array, refer to API documentation.
      .extendHourly(true) // optional: extend, boolean, refer to API documentation.
      .get() // execute your get request.
      .then(weatherData => {
        this.sendFormattedWeather(data, weatherData);
      })
      .catch(err => {
        console.error(err);
        this.bot.postMessageWithParams(data.channel, err, botParams);
      });
  }

  help() {
    return 'Usage: `?weather` gives current forecast for NYC';
  }

  sendFormattedWeather(data, weatherData) {
    var title = util.format(
      'Currently: %d°',
      weatherData.currently.apparentTemperature
    );
    var summary = util.format(
      '%s for the hour. %s\n\n %d%% humidity with wind speed of %d MPH',
      weatherData.currently.summary,
      weatherData.hourly.summary,
      weatherData.currently.humidity * 100,
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
