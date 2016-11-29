var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');

var state = JSON.parse(fs.readFileSync('public/graph.json', 'utf8'));

app.use(express.static('bower_components'))
app.use(express.static('public'))
app.use(express.static('node_modules/socket.io/lib'))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/state', function(req, res){
  res.send(state);
});

app.post('/status', function (req, res) {

  state.nodes = _.map(state.nodes, function(item){
    return _.extend(item, _.find(req.body.nodes, { id: item.id }));
  });

  state.version = req.body.version;

  io.emit('status change', { 
  	for: 'everyone',
  	body: req.body
  });

  res.send(req.body)
});

app.post('/release', function (req, res) {
  state = JSON.parse(fs.readFileSync('public/graph.json', 'utf8'));
  state.version = req.body.version;

  io.emit('release', { 
  	for: 'everyone',
  	body: req.body
  });

  res.send(req.body)
})

io.on('connection', function(socket){
  console.log('a user connected');

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});