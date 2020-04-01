'use strict';


module.exports = class HelloWorldEndpoint extends BaseModule {
  createRoutes(app) {
    app.get(`/teams/android/firefighter/details`, async (req, res) => {
      res.json({
        "details": {
          "slackId": "ASDAf#@4"
        }
      });
    });
  }

  secretHash() {
    return "fooo1234"
  }

  help() {
    return `Example of an endpoint that can be used as a webhook!`;
  }

  getType() {
    return [
      BaseModule.TYPES.ENDPOINT,
    ];
  }
};
