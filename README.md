# SlackCat
[![license](https://img.shields.io/badge/license-APACHE2-blue.svg?style=flat)](https://raw.githubusercontent.com/konecnyna/slack-cat/master/LICENSE)
[![Build Status](https://travis-ci.org/konecnyna/slack-cat.svg?branch=master)](https://travis-ci.org/konecnyna/slack-cat)

When you want slack to turn into a tire fire.

<img src="https://github.com/konecnyna/slack-cat/raw/master/core/tire-fire.gif" height="300px"/>

# Getting Started

It's ezpz.

1. run `npm install`
2. Add your slack api key to config.dat file in the root dir.
3. node `index.js`

Example `config.dat`:
```
{
    "slack_api": "xxx",
    "darksky_api": "xxx",
    "google_geocode_api": "xxx",
    "pager_duty_api": "xxx",
    "jira_api": {
    	"host": "xxx",
    	"username": "xxx",
    	"password": "xxx"
    },
    "modules_blacklist": []
}
```

# Modules

Look at the modules in the `modules/default` folder for examples. If there are core modules that you wouldn't like in slackcat you can add them to the "modules_blacklist".

For example: `"modules_blacklist": ["poop"]` in `config.dat` file would exclude the `?poop` command from slackcat.


##### Usage:

Assuming the above module was stored in the `modules/users/helloworld` path

`?hellworld` or `?hello_world2` would return `Hello World!!!`


##### Example Module:

Modules will have an `index.js` file nested in a folder in the `modules` directory. The folder name containing in the `index.js` file will be the default command name.

For example:

```
├── modules/
|   └── user/
│       └── hrviolation/
|           └── index.js
```

Sending `?hrviolation` will trigger the `index.js` in the hrviolation directory. You can add custom aliases for commands by overriding the `aliases()` method in BaseModule.


Example Module `index.js` file:

```javascript
'use strict';

module.exports = class HelloWorld extends BaseModule {
  handle(data) {
    this.bot.postMessage(
      data.channel,
      'Hello World!!!',
      {
        icon_emoji: ':cat:'
      }
    );
  }

  help() {
    return "Usage: `?helloworld2` should print:\n'Hello World Number 2!!!'";
  }

  aliases() {
    return ['hello_world2']; // Now helloworld (folder name) or helloworld2 will trigger this module.
  }

  getType() {
    return BaseModule.TYPES.MODULE;
  }
};
```

| Type  | Desc  |
|---|---|
| MODULE | This is the default type. Use this when making a new cmd and call with `?<your_cmd_name> <args>`   |
| OVERFLOW\_CMD | This module type is to handle commands that the router doesn't know how to handle. See `LearnOverflowAlises` for an example.   |
| REACTION | This module is for handling when a user reacts to a post with an emoji. See the `Reactions` module for more info.  |



# Debugging

If you are testing you will often get rate limited. In order to test your cmd from the command line run

`node index.js <cmd> <args>`

eg:
`node index.js ?summon test`

Will summon a google image matching test keyword.

# Enivorments

`NODE_ENV="production" node index.js` will start the app in production mode which will use `db.sqlite`. Otherwise it will use `db-dev.sqlite`. This is useful in tests as not to corrupt production data.
