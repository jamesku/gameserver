// const express = require('express');
// const http = require('http');
// const url = require('url');
// const WebSocket = require('ws');
//
// const app = express();
//
// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });
//
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
//
// wss.on('connection', function connection(ws, req) {
//   console.log("connection");
//
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//
//   ws.send('something');
// });
//
// server.listen(5000, function listening() {
//   console.log('Listening on %d', server.address().port);
// });


const express = require('express');
const app = express();
const WebSocket = require('ws');

var server = require('http').createServer(app);
const wss =  new WebSocket.Server({ server });
var path = require('path');

// app.use(express.static(path.join(__dirname, 'public')));

let gameArray = []
let colorArray = ['red', 'blue', 'purple', 'green', 'orange', 'yellow', 'brown', 'gray', 'gold', 'white', 'pink'];
let turn = 0;
let playerassignment=0;
let readyCount=0;


const port = process.env.PORT || 5000;

server.listen(port, function () {
  console.log('WS Server listening at port %d', port);
});


wss.on('connection', function (client, req) {
  console.log("client connected");

  //New Connection
  client.on('disconnect', function () {
      console.log('user disconnected');
   });

   client.on('message', function incoming(msg) {
     msg = JSON.parse(msg);
     switch(msg.type) {
         case "setName":
         console.log("setnmaefired");
         playerassignment++;
         let thisplayer = 'player'+playerassignment;
         let color = colorArray[playerassignment-1];
         thisplayer = {
           playernumber: playerassignment,
           name:msg.name,
           tile:0,
           color:color,
           ready:false
         };
         gameArray.push({thisplayer:thisplayer});
         console.log(gameArray);

         client.send( JSON.stringify({
           type:'playerSetup',
           name: msg.name,
           playerassigned: playerassignment,
           playercolor:color
         }));
           break;
          case "signalReady":
          readyCount++;
          if(readyCount===playerassignment){
          console.log(readyCount +  'players ready to go');
         }
       }
    });


   });
