#!/usr/bin/env node

// override the node env
process.env.NODE_ENV = 'production';

const { Command } = require('commander');
const program = new Command();
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
		SharedManager.logger.info('Beanmaster daemon started. PID: ' + pid + ', port: ' + (program.port || config.port));
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

program
	.version(pjson.version, '-v')
	.option('-p, --port <n>', 'Specify the port number', parseInt);

program
	.command('start')
	.description('Start server as a daemon process')
	.action(() => {
		startServer();
	});

program
	.command('status')
	.description('Show server daemon status')
	.action(() => {
		serverStatus();
	});

program
	.command('restart')
	.description('Restart server daemon')
	.action(() => {
		restartServer();
	});

program
	.command('stop')
	.description('Stop server daemon')
	.action(() => {
		stopServer();
	});

program
	.command('kill')
	.description('Kill server daemon')
	.action(() => {
		killServer();
	});

program
	.command('serve', { isDefault: true })
	.description('launch web server')
	.action(() => {
		require('./server');
	});

program.parse(process.argv);