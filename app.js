const express = require('express');
const indexRouter = require('./routes/index');
const app = express();
const WebSocket = require('ws');

// view engine setup

const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error');
});

wss.on('listening' , () => console.log('Websocket listening on port 8080'));
wss.on('connection', function connection(ws) {
  console.log('New connection')
  clients.push(ws);
  ws.on('message', function incoming(message) {
    message = JSON.parse(message);
    if(message.sensor === 'motion' && message.value === true) {
      console.log('Motion detected');
      clients.forEach(function each(client) {
        const newmessage = {
          type : 'wildlife',
          data : {
            animal : 'bear',
          }
        }
        client.send(JSON.stringify(newmessage));
      });
    } 
    else if(message.sensor === 'fire' && message.value === true)
    {
      console.log('Fire detected');
      clients.forEach(function each(client) {
        const newmessage = {
          type : 'fire',
          data : {}
        }
        client.send(JSON.stringify(newmessage));
      });
    }
  });
});

module.exports = app;
