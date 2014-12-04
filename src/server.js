var express = require('express');
var config = require('./app/config/config');
var app = express();

var args = process.argv,
	arg = null;

var port = null;

while (arg = args.shift()) {
	if (arg === '--port' || arg === '-p') {
		port = args.shift();
	}
}

if (!port || isNaN(port)) {
	port = config.port;
}

// Bootstrap application settings
require('./app/config/express')(app);

// Bootstrap routes
require('./app/config/routes')(app);

app.listen(port);
console.log('Beanmaster started on port ' + port);