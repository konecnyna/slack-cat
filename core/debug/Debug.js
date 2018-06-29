const MockBot = require('../mock-bot');
const Router = require('../router');
const Message = require('./Message');
const MemberJoin = require('./MemberJoin');
const Reaction = require('./Reaction');

module.exports = class Debug {
  runDebugCommand(process) {
    const router = new Router(new MockBot(), this.pathToModules);
    console.log(process.argv);
    if (process.argv[2].includes('member_joined_channel')) {
      console.log('Executing member joined');
      router.handle(new MemberJoin());
      return;
    }

    if (process.argv[2].includes(':')) {
      const reaction = process.argv[2].replace(new RegExp(':', 'g'), '');
      console.log('Executing reaction: ' + reaction);
      router.handle(new Reaction(reaction));
      return;
    }

    // Regular debug message
    const userText = process.argv.splice(2, process.argv.length - 1).join(' ');
    router.handle(new Message(userText));
    return;
  }
};
