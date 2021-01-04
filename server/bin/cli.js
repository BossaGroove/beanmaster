#!/usr/bin/env node

// override the node env
process.env.NODE_ENV = 'production';

const commander = require('commander');
const p = require('path');
const daemonize = require('daemonize2');
const pjson = require('../../package.json');
const Utility = require('../lib/implementation/utility');
const SharedManager = require('../lib/implementation/shared_manager');

const config = require(`${__dirname}/../../config`);

let daemon = null;

const BEANMASTER_HOME_PATH = Utility.getHomePath();

const BEANMASTER_PID_PATH = BEANMASTER_HOME_PATH + '/beanmaster.pid';

function startServer() {
	daemon.start().once('started', function () {
		process.exit();
	});
}

function serverStatus() {
	const pid = daemon.status();
	if (pid) {
		SharedManager.logger.info('Beanmaster daemon running. PID: ' + pid);
	} else {
		SharedManager.logger.info('Beanmaster daemon is not running.');
	}
}

function restartServer() {
	if (daemon.status()) {
		daemon.stop().once('stopped', function () {
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

const daemonOption = {
	main: p.resolve(__dirname, './server.js'),
	name: 'beanmaster',
	pidfile: BEANMASTER_PID_PATH,
	silent: true
};

daemon = daemonize.setup(daemonOption);

daemon
	.on('starting', function () {
		SharedManager.logger.info('Starting Beanmaster daemon...');
	})
	.on('started', function (pid) {
		SharedManager.logger.info('Beanmaster daemon started. PID: ' + pid + ', port: ' + (commander.port || config.port));
	})
	.on('stopping', function () {
		SharedManager.logger.info('Stopping Beanmaster daemon...');
	})
	.on('stopped', function () {
		SharedManager.logger.info('Beanmaster daemon stopped.');
	})
	.on('running', function (pid) {
		SharedManager.logger.info('Beanmaster daemon already running. PID: ' + pid);
	})
	.on('notrunning', function () {
		SharedManager.logger.info('Beanmaster daemon is not running');
	})
	.on('error', function (err) {
		SharedManager.logger.error(err);
		SharedManager.logger.error(err.stack);
		SharedManager.logger.error('Beanmaster daemon failed to start:  ' + err.message);
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
	require('./server');
}
