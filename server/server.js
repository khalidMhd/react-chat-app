const express = require('express');
const app = express();
const  mongoose = require("mongoose");
const Pusher = require("pusher")
const Cors = require("cors")
const messages = require('./dbMessages')

const PORT =process.env.PORT || 9000

mongoose.connect('mongodb://khalid:khalid21@polio-shard-00-00.rfmfy.mongodb.net:27017,polio-shard-00-01.rfmfy.mongodb.net:27017,polio-shard-00-02.rfmfy.mongodb.net:27017/polio?ssl=true&replicaSet=atlas-nzxqqa-shard-0&authSource=admin&retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log("Database Connected")

    const msgCollection  = db.collection("messagecontents")
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log("changes Occure",change)
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                recieved:  messageDetails.recieved
            })
        } else {
            console.log("Error trigging Pusher");
        }
    });
});


const pusher = new Pusher({
    appId: "1213364",
    key: "6c2ca9e2aff2bc52d06e",
    secret: "8cad758a528e17d4401a",
    cluster: "eu",
    useTLS: true
  });

app.use(express.json())
app.use(Cors())

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin","*")
//     res.setHeader("Access-Control-Allow-Headers","*")
//     next()
// })

app.get("/", (req, res) => {
  res.status(200).send("node js")
});

app.get("/messages/sync", (req, res) => {
  messages.find((err, data)=> {
      if (err) {
          res.status(500).send(err)
      } else {
          res.status(200).send(data)
      }
  })
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  messages.create(dbMessage, (err,data) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.status(201).send(data)
      }
  })
});

app.listen(PORT,()=>{
    console.log('Port is running on PORT: ' , PORT)
})