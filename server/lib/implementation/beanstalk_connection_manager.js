const Fivebeans = require('fivebeans');
const bluebird = require('bluebird');
const debug = require('debug')('bs');

class BeanstalkConnectionManager {
	static async connect(host, port) {
		if (!host || !port) {
			throw new Error('Host or port invalid');
		}

		const portInt = parseInt(port, 10);

		debug(`Try to initiate a new beanstalk connection: ${host} / ${portInt}`);

		const client = new Fivebeans.client(host, portInt);

		bluebird.promisifyAll(client, {
			multiArgs: true
		});

		client.connect();

		await (new Promise((resolve, reject) => {
			client.on('connect', () => {
				debug(`Connected: ${host} / ${portInt}`);
				resolve();
			});
			client.on('error', (err) => {
				reject(err);
			});

			setTimeout(() => {
				reject('timeout');
			}, 10000);
		}));

		return client;
	}

	static async closeConnection(connection) {
		debug(`Try to end a connection: ${connection.host} / ${connection.port}`);
		connection.end();
	}
}

module.exports = BeanstalkConnectionManager;
