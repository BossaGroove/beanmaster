#!/usr/bin/env node

var pjson = require('../package.json'),
	commander = require('commander'),
	config = require('../app/config/config'),
	p = require('path'),
	daemonize = require('daemonize2'),
	daemon = null;

function startServer() {
	daemon.start().once('started', function() {
		process.exit();
	});
}

function serverStatus() {
	var pid = daemon.status();
	if (pid) {
		console.log('Beanmaster daemon running. PID: ' + pid);
	} else {
		console.log('Beanmaster daemon is not running.');
	}
}

function restartServer() {
	if (daemon.status()) {
		daemon.stop().once('stopped', function() {
			startServer();
		});
	} else {
		startServer();
	}
}

function stopServer() {
	daemon.stop();
}

function killServer() {
	daemon.kill();
}

commander
	.version(pjson.version)
	.option('-p, --port <n>', 'Specify the port number', parseInt)
	.option('start', 'Start server as a daemon process')
	.option('status', 'Show server daemon status')
	.option('restart', 'Restart server daemon')
	.option('stop', 'Stop server daemon')
	.option('kill', 'Kill server daemon')
	.parse(process.argv);

var daemon_option = {
	main: p.resolve(__dirname, '../server.js'),
	name: 'beanmaster',
	pidfile: p.resolve(__dirname, '../etc/beanmaster.pid'),
	silent: true
};

if (commander.port) {
	daemon_option.args = ['-p ' + commander.port];
}

daemon = daemonize.setup(daemon_option);

daemon.on('starting', function() {
	console.log('Starting Beanmaster daemon...');
}).on('started', function(pid) {
	console.log('Beanmaster daemon started. PID: ' + pid + ', port: ' + (commander.port || config.port));
}).on('stopping', function() {
	console.log('Stopping Beanmaster daemon...');
}).on('stopped', function() {
	console.log('Beanmaster daemon stopped.');
}).on('running', function(pid) {
	console.log('Beanmaster daemon already running. PID: ' + pid);
}).on('notrunning', function() {
	console.log('Beanmaster daemon is not running');
}).on('error', function(err) {
	console.log('Beanmaster daemon failed to start:  ' + err.message);
});

if (commander.start) {
	startServer();
} else if (commander.status) {
	serverStatus();
} else if (commander.restart) {
	restartServer();
} else if (commander.stop) {
	stopServer();
} else if (commander.kill) {
	killServer();
} else {
	require('../server');
}