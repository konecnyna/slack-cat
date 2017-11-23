'use strict';

const util = require('util');
const request = require('request');

const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s"
module.exports = class GoogleGeocodeApi {

  async getLongLat(input) {      
    try {
      const response = await this.getData(input);         
      const location = response.results[0].geometry.location;      
      
      return {
        lat: location.lat,
        lng: location.lng,
        name: response.results[0].address_components[0].long_name
      }

    } catch(err) {
      return false;
    }    
  }

  getData(input) {
    var options = {
      url: "https://maps.googleapis.com/maps/api/geocode/json",      
      qs: {
        address: input,
        key: process.env.GOOGLE_GEOCODE_API_KEY
      }
    };


    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(JSON.parse(body));
      });
    });  
  }
  
};
