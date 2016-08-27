'use strict';

const root = require('app-root-path');
const express = require('express');
const commander = require('commander');

const config = require(`${root}/config`);

const lib = require(`${root}/lib`);

commander
	.option('-p, --port <n>', 'Specify the port number', parseInt)
	.parse(process.argv);

const port = commander.port || config.port;

console.log('Beanmaster listening port ' + port);

// Bootstrap application settings
lib.SharedManager.app = require(`${root}/app/setup/express`);

lib.SharedManager.app.listen(port);
