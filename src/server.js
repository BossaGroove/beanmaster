var express = require('express');
var config = require('./app/config/config');
var app = express();

// Bootstrap application settings
require('./app/config/express')(app);

// Bootstrap routes
require('./app/config/routes')(app);

app.listen(config.port);
console.log('Nodestalking app started on port ' + config.port);

module.exports = app;