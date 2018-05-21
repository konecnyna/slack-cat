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

const radarMap = {
  "AR":"lit",
  "AZ":"prc",
  "CA":"bfl",
  "CO":"den",
  "CT":"hfd",
  "FL":"eyw",
  "FL":"pie",
  "GA":"csg",
  "IA":"dsm",
  "ID":"myl",
  "IL":"spi",
  "KS":"sln",
  "KY":"bwg",
  "LA":"msy",
  "MI":"cad",
  "MN":"stc",
  "MO":"jef",
  "MS":"tvr",
  "MT":"lwt",
  "NC":"clt",
  "ND": "bis",
  "NE":"lbf",
  "NH":"bml",
  "NM":"row",
  "NV": "rno",
  "NY":"bgm",
  "OH": "day",
  "OK":"law",
  "OR":"rdm",
  "SD":"pir",
  "TX":"bro",
  "TX":"sat",
  "UT": "pvu",
  "VA": "fcx",
  "WA": "tiw",
  "WY": "riw",
}

module.exports = class Weather extends BaseModule {
  async handle(data) {
    if (this.aliases().includes(data.cmd)) {
      this.handleRadar(data);
      return;
    }

    if (!config.getKey('darksky_api') || !config.getKey('google_geocode_api')) {
      this.bot.postMessage(
        data.channel,
        'Please put `darksky_api` or `google_geocode_api` key in `config.json`'
      );
      return;
    }

    let query = data.user_text;
    if (!query) {
      query = 'nyc';
    }

    const coords = await geocoder.getLongLat(query);
    if (!coords) {
      this.bot.postMessage(data.channel, 'No location found.');
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
    let img = '';
    if (!data.user_text) {
      this.bot.postMessage(data.channel, "http://images.intellicast.com/WxImages/RadarLoop/usa_None_anim.gif");
      return;
    }

    const location = radarMap[data.user_text.toUpperCase()];
    if (location) {
      img = `http://images.intellicast.com/WxImages/RadarLoop/${location}_None_anim.gif`;
    } else {
      img = 'http://images.intellicast.com/WxImages/RadarLoop/usa_None_anim.gif';  
    }
    
    this.bot.postMessage(data.channel, img);
  }

  help() {
    return (
      'Usage: `?weather` gives current forecast for NYC. More cmds: ' +
      this.aliases()
    );
  }

  aliases() {
    return ['us-radar', 'ne-radar', 'nyc-radar', 'radar'];
  }

  sendFormattedWeather(data, weatherData, location) {
    const title = `Currently in ${location}: ${parseInt(weatherData.currently.apparentTemperature)}°`;
            
    

    const summary = util.format(
      'Forecast: %s for the hour. %s\n\n %d%% humidity with wind speed of %d MPH',
      weatherData.currently.summary,
      weatherData.hourly.summary,
      parseInt(weatherData.currently.humidity * 100),
      weatherData.currently.windSpeed
    );

    const emoji = this.weatherEmoji(weatherData.hourly.icon);    

    this.bot.postFancyMessage(
      data.channel,
      emoji,
      '#ddd',
      title,
      summary,
      botParams
    );
  }

  weatherEmoji(icon) {    

  	switch(icon) {
  		case "clear-day":
  			return ":sunny:";  			
  		case "clear-night":
  			return ":new_moon:";  		
		case "snow":
		case "sleet":
			return ":snow_cloud:";		
		case "wind":
			return ":wind_blowing_face:";
		case "fog":
			return ":foggy:";
		case "cloudy":
			return ":cloud:";
		case "partly-cloudy-day":
			return ":sun_small_cloud:";
		case "partly-cloudy-night":
			return ":partly_sunny:";
		case "rain":
			return ":rain_cloud:";
		default:
			return ":sunny:";
  	}  	
  }
};
