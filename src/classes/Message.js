const User = require('./User');
const Channel = require('./Channel');
const sendMessage = require('../helpers/sendMessage');
const sendRequestToDlive = require('../helpers/sendRequestToDlive');

var env = process.env.NODE_ENV || 'production';
let print = console.log;
if (env === 'production') {
  print = () => {};
}

// TODO impliment a 'reply' feature which will send a message back to that channel that the message came from

const Message = class {
  constructor(
    message,
    streamerBlockchainUsername,
    streamerDliveUsername,
    permissionObj
  ) {
    let _permissionObj = permissionObj;
    this.content = message.content ? message.content : '';
    this.type = message.type;
    this.createdAt = message.createdAt ? message.createdAt : Date.now();
    this.id = message.id;
    this.role = message.role;
    this.roomRole = message.roomRole;
    if (!message.sender) {
      print('NO MESSAGE SENDER', message);
    }
    this.sender = message.sender
      ? new User(message.sender, permissionObj)
      : null;
    this.streamerBlockchainUsername = streamerBlockchainUsername;
    this.streamerDliveUsername = streamerDliveUsername || null;
    this.getPermissionObj = () => {
      return _permissionObj;
    };
  }

  reply(replyMsg) {
    sendMessage(
      replyMsg,
      this.streamerBlockchainUsername,
      this.getPermissionObj()
    );
  }

  delete() {
    return sendRequestToDlive(
      this.getPermissionObj(),
      {
        operationName: 'DeleteChat',
        query: `mutation DeleteChat($streamer: String!, $id: String!) {
          chatDelete(streamer: $streamer, id: $id) {
            err {
              code
              message
              __typename
            }
            __typename
          }
        }`,
        variables: {
          id: this.id,
          streamer: this.streamerBlockchainUsername
        }
      }
    )
  }
};

module.exports = Message;
