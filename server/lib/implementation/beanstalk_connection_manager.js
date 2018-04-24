'use strict';

const Fivebeans = require('fivebeans');
const bluebird = require('bluebird');
const debug = require('debug')('bs');

class BeanstalkConnectionManager {
	static async connect(host, port) {
		if (!host || !port) {
			throw new Error('Host or port invalid');
		}

		const port_int = parseInt(port, 10);

		debug(`Try to initiate a new beanstalk connection: ${host} / ${port_int}`);

		const client = new Fivebeans.client(host, port_int);

		bluebird.promisifyAll(client, {
			multiArgs: true
		});

		client.connect();

		await (new Promise((resolve, reject) => {
			client.on('connect', () => {
				debug(`Connected: ${host} / ${port_int}`);
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
