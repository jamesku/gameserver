const express = require('express');
const app = express();
const WebSocket = require('ws');
const goGetTrivia = require('./goGetTrivia.js');
const jsonfile = require('jsonfile');

var server = require('http').createServer(app);
const wss = new WebSocket.Server({server});
var path = require('path');

// var fileE = './trivia/triviaEasy.json';
// var fileM = './trivia/triviaMedium.json';
// var fileH = './trivia/triviaHard.json';
var easyQs = [];
var hardQs = [];
var mediumQs = [];

let webSockets = {}; // userID: webSocket
let messageBack = "";
let playerArray = [];
let categories = [];
let colorArray = [
  'red',
  'blue',
  'purple',
  'green',
  'orange',
  'yellow',
  'brown',
  'gray',
  'gold',
  'white',
  'pink'
];
let turn = 0;
let playernumber = 0;
let readyCount = 0;
let trivia = [];
let initialSplicePoint;

const port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log('WS Server listening at port %d', port);
});

wss.on('connection', function(client, req) {

  //New Connection
  client.on('close', function() {})

  client.on('message', function incoming(msg) {
    msg = JSON.parse(msg);
    switch (msg.type) {
      case "setName":
        playernumber++;
        //make a player
        let thisplayer = 'player' + playernumber;
        let playercolor = colorArray[playernumber - 1];
        thisplayer = {
          playernumber: playernumber,
          name: msg.name,
          playerposition: 1,
          playercolor: playercolor
        };
        //add the player to the game
        playerArray.push(thisplayer);
        //record which player uses which socket
        webSockets[thisplayer] = client;
        //add a type for a message and send it to client and gameboard
        thisplayer['type'] = 'playerSetup';
        messageBack = JSON.stringify(thisplayer);
        client.send(messageBack);
        webSockets["gameboard"].send((messageBack))
        //console player joined
        console.log('connected: ' + thisplayer );
        break;
      case "signalReady":
        goGetTrivia.goGetTrivia(msg.categoryNumber);
        readyCount++;
        //when someone is ready, send their preferred category out
        messageBack = JSON.stringify({type: 'categorySetup', name: msg.name, playernumber: playernumber, category: msg.category});
        webSockets["gameboard"].send((messageBack));
        //record the category on the server
        categories.push(msg.category);
        //go hit the API to populate the local JSON files with trivia

          if (readyCount === playernumber) {
            turn = Math.floor(Math.random() * (readyCount));

            trivia = goGetTrivia.returnTrivia();
            initialSplicePoint = Math.floor(Math.random() * (trivia[1].length));

            hardquestion = trivia[1].splice(initialSplicePoint, 1);
            category = hardquestion.category;
            console.log("category: " + category);
            easyquestion = trivia[0].splice(initialSplicePoint, 1);
            mediumquestion = trivia[2].splice(initialSplicePoint, 1);

            messageBack = JSON.stringify({type: 'playerTurn',
                                          turn: turn,
                                          category:category,
                                          hardquestion:hardquestion,
                                          easyquestion:easyquestion,
                                          mediumquestion:mediumquestion,
                                        });
            webSockets["gameboard"].send((messageBack));
          }

        //if everyone is ready pick who our first player is going to be
        break;
      case "gameboardconnected":
        webSockets["gameboard"] = client;
        console.log('connected: ' + "gameboard");
      case "submitChoice":
        messageBack = JSON.stringify(msg);
        webSockets["gameboard"].send((messageBack);
      default:
        return;
    }
  });

});

// webSocket.on('message', function(message) {
//   console.log('received from ' + userID + ': ' + message)
//   var messageArray = JSON.parse(message)
//   var toUserWebSocket = webSockets[messageArray[0]]
//   if (toUserWebSocket) {
//     console.log('sent to ' + messageArray[0] + ': ' + JSON.stringify(messageArray))
//     messageArray[0] = userID
//     toUserWebSocket.send(JSON.stringify(messageArray))
//   }
// })
