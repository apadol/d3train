const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const fs = require('fs');
const _ = require('lodash');

let state = JSON.parse(fs.readFileSync('public/graph.json', 'utf8'));

app.use(express.static('bower_components'))
app.use(express.static('public'))
app.use(express.static('node_modules/socket.io/lib'))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => { res.sendFile(__dirname + '/public/index.html') });
app.get('/state', (req, res) => { res.send(state) });

app.post('/status', (req, res) => {
  state.nodes = _.map(state.nodes, (item) => {
    return _.extend(item, _.find(req.body.nodes, { id: item.id }));
  });

  state.version = req.body.version;

  io.emit('status change', { 
  	for: 'everyone',
  	body: req.body
  });

  res.send(req.body)
});

app.post('/release', (req, res) => {
  state = JSON.parse(fs.readFileSync('public/graph.json', 'utf8'));
  state.version = req.body.version;

  io.emit('release', { 
  	for: 'everyone',
  	body: req.body
  });

  res.send(req.body)
})

io.on('connection', (socket) => { console.log('a user connected') });
http.listen(3001, () => { console.log('listening on *:3001') });