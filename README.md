# SlackCat
[![license](https://img.shields.io/badge/license-APACHE2-blue.svg?style=flat)](https://raw.githubusercontent.com/konecnyna/slack-cat/master/LICENSE)
[![Build Status](https://travis-ci.org/konecnyna/slack-cat.svg?branch=master)](https://travis-ci.org/konecnyna/slack-cat)

When you want slack to turn into a tire fire.

<img src="https://github.com/konecnyna/slack-cat/raw/master/core/tire-fire.gif" height="300px"/>

### Modules

Look at the modules in the `modules/default` folder for examples.

##### Example Module:

Modules will have an `index.js` file nested in a folder in the `modules` directory. The folder name containing in the `index.js` file will be the default command name.

For example:

```
├── modules/
│   └── hrviolation/
|       └── index.js
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


##### Usage:

Assuming the above module was stored in the `modules/users/helloworld` path

`?hellworld` or `?hello_world2` would return `Hello World!!!`



### Debugging

If you are testing you will often get rate limited. In order to test your cmd from the command line run

`node index.js <cmd> <args>`

eg:
`node index.js ?summon test`

Will summon a google image matching test keyword.
