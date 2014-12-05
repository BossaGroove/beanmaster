#!/usr/bin/env node
process.env.PM2_SILENT = true;

var pjson = require('../package.json');
var pm2 = require('pm2');
var commander = require('commander');
var config = require('../app/config/config');

function startServer() {
	pm2.connect(function(err) {
		if (err) {
			console.log('PM2 connect failed');
			console.log(err);
		} else {
			var options = {
				name: 'beanmaster'
			};

			if (commander.port) {
				options.scriptArgs = ['-p', commander.port];
			}

			pm2.start(__dirname + '/../server.js', options, function(err, proc) {
				if (err) {
					console.log('Beanmaster startup failed');
				} else {
					console.log('Beanmaster listening port ' + (commander.port || config.port));
				}
				pm2.disconnect(function() {
					process.exit(0)
				});
			});
		}
	})
}

function listServer() {
	pm2.connect(function(err) {
		if (err) {
			console.log('PM2 connect failed');
			console.log(err);
		} else {
			pm2.list(function(err, process_list) {
				console.log(process_list);
				pm2.disconnect(function() {
					process.exit(0)
				});
			});
		}
	})
}

function restartServer() {
	pm2.connect(function(err) {
		if (err) {
			console.log('PM2 connect failed');
			console.log(err);
		} else {
			pm2.restart('beanmaster', function(err, process_list) {
				if (err) {
					console.log(err);
				} else {
					console.log('Beanmaster server restarted');
				}
				pm2.disconnect(function() {
					process.exit(0)
				});
			});
		}
	})
}

function stopServer() {
	pm2.connect(function(err) {
		if (err) {
			console.log('PM2 connect failed');
			console.log(err);
		} else {
			pm2.delete('beanmaster', function(err, proc) {
				if (err) {
					console.log(err.msg);
				} else {
					console.log('Beanmaster server stopped');
				}
				pm2.disconnect(function() {
					process.exit(0)
				});
			});
		}
	})
}

commander
	.version(pjson.version)
	.option('-p, --port <n>', 'Specify the port number', parseInt)
	.option('start', 'Start server as a daemon process')
	.option('list', 'Show server daemon detail')
	.option('restart', 'Restart server daemon')
	.option('stop', 'Stop server daemon')
	.parse(process.argv);

if (commander.start) {
	startServer();
} else if (commander.list) {
	listServer();
} else if (commander.restart) {
	restartServer();
} else if (commander.stop) {
	stopServer();
} else {
	require("../server");
}