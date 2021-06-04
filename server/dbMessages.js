const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chattingChema = new Schema({
 message : {
    type: String,
  },
  name: {
      type:String
  },
  timestamp: {
      type: String
  },
  recieved: {
      type: Boolean
  }
});

const chatting = mongoose.model("messagecontents",chattingChema );
module.exports = chatting