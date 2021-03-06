const DLive = require('../');
const config = require('./config');

let dLive = new DLive({
  authKey: 'YOUR AUTH KEY'
});
// listenToChat takes one variable and it's the dlive displayname of a user aka what you see in the url!
dLive.listenToChat('creativebuilds').then(messages => {
  // messages is a rxjs behavioursubject that will give you the latest msgs on subscribing.
  messages.subscribe(msg => {
    // Reply to chat like so
    msg.reply('Thanks for the message son!');

    // We can also delete messages, for example when trimmed content is equal to "delet this"
    if(msg.content.trim() == 'delet this') {
      msg.delete()
    }
  });
});
