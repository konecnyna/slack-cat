'use strict';

const DarkSky = require('dark-sky');
const util = require('util');
const GoogleGeocode = require('./google-geocode-api.js');
const geocoder = new GoogleGeocode();

const darksky = new DarkSky(config.getKey('darksky_api'));
const botParams = {
  icon_emoji: ':cat:',
  username: 'WeatherCat',
};

module.exports = class Weather extends BaseModule {

  async handle(data) {
    if (!config.getKey('darksky_api') || !config.getKey('google_geocode_api')) {
      this.bot.postMessage(data.channel, "Please put `darksky_api` or `google_geocode_api` key in `config.dat`");
      return;
    }

    if (this.aliases().includes(data.cmd)) {
      this.handleRadar(data);
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

  handleRadar(data) {
    let img = ""
    switch (data.cmd) {
      case 'us-radar':
        img = "http://images.intellicast.com/WxImages/RadarLoop/usa_None_anim.gif";
        break;

      case 'radar':
      case 'ne-radar':
      case 'nyc-radar':
        img = "http://images.intellicast.com/WxImages/RadarLoop/hfd_None_anim.gif";
        break;

      default:
        img = 'No radar found';        
    }


    this.bot.postMessage(data.channel, img);    
  }

  help() {
    return 'Usage: `?weather` gives current forecast for NYC. More cmds: ' + this.aliases() ;
  }

  aliases() {
    return ['us-radar', 'ne-radar', 'nyc-radar', 'radar'];
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
