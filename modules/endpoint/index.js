'use strict';


module.exports = class HelloWorldEndpoint extends BaseModule {
  createRoutes(app) {
    app.get(`/hello-world`, async (req, res) => {
      res.json({
        "hello": "world!!!!!!!!!!"
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
