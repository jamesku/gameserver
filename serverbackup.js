const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');

let gameArray = []
let colorArray = ['red', 'blue', 'purple', 'green', 'orange', 'yellow', 'brown', 'gray', 'gold', 'white', 'pink'];
let turn = 0;
let playerassignment=0;
let readyCount=0;

const app = express();
const port = process.env.PORT || 5000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

var numPlayers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});


var json_body_parser = bodyParser.json();
var urlencoded_body_parser = bodyParser.urlencoded({ extended: true });
app.use(json_body_parser);
app.use(urlencoded_body_parser);

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From James' });
});

app.post('/api/postname', (req, res) => {
  playerassignment++;
  let thisplayer = 'player'+playerassignment;
  let color = colorArray[playerassignment-1];
  thisplayer = {
    playernumber: playerassignment,
    name:req.body.name,
    tile:0,
    color:color,
    ready:false
  };
  gameArray.push({thisplayer:thisplayer});
  console.log(gameArray);

  res.send({ playerassigned: playerassignment, playercolor:color });

});

app.post('/api/tvready', (req, res) => {

});

app.post('/api/ready', (req, res) => {
res.send({ "ok": "ok"});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
