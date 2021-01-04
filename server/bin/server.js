const appRoot = `${__dirname}/..`;
const config = require(`${appRoot}/../config`);

const { Command } = require('commander');
const program = new Command();

const lib = require(`${appRoot}/lib`);

program
	.option('-p, --port <n>', 'Specify the port number', parseInt)
	.parse(process.argv);

const port = program.port || config.port;

// Bootstrap application settings
lib.SharedManager.app = require(`${appRoot}/setup/app`);

lib.SharedManager.app.listen(port);

lib.SharedManager.logger.info('Beanmaster listening port ' + port);
