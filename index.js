var fs = require('fs');
var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(connect.cookieParser())
  .use(connect.session({ secret: 'so much fun' }));

var server = http.createServer(app).listen(5000);
console.log('up and running on port 5000');

var io = require('socket.io').listen(server);

io.set('log level', 1);

var gameServer = require('./server.js').listen(io);
