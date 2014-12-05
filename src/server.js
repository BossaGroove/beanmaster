var express = require('express'),
	commander = require('commander');

var app = express(),
	config = require('./app/config/config');

commander
	.option('-p, --port <n>', 'Specify the port number', parseInt)
	.parse(process.argv);

port = commander.port || config.port;

console.log('Beanmaster listening port ' + port);

// Bootstrap application settings
require('./app/config/express')(app);

// Bootstrap routes
require('./app/config/routes')(app);

app.listen(port);