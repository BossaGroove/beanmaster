'use strict';

const app_root = `${__dirname}/../`;
const commander = require('commander');

const config = require(`${app_root}/config`);

const lib = require(`${app_root}/lib`);

commander
	.option('-p, --port <n>', 'Specify the port number', parseInt)
	.parse(process.argv);

const port = commander.port || config.port;

// Bootstrap application settings
lib.SharedManager.app = require(`${app_root}/app/setup/express`);

lib.SharedManager.app.listen(port);

console.log('Beanmaster listening port ' + port);
