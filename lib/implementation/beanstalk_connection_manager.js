/**
 * Created by Bossa on 2014/10/05.
 */

'use strict';

const Fivebeans = require('fivebeans');
const bluebird = require('bluebird');

class BeanstalkConnectionManager {
	async connect(host, port) {
		if (!host || !port) {
			throw new Error('Host or port invalid');
		}

		port = parseInt(port, 10);

		console.log(`Try to initiate a new beanstalk connection: ${host} / ${port}`);

		const client = new Fivebeans.client(host, port);

		bluebird.promisifyAll(client, {
			multiArgs: true
		});

		client.connect();

		await (new Promise((resolve, reject) => {
			client.on('connect', () => {
				console.log(`Connected: ${host} / ${port}`);
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

	async closeConnection(connection) {
		console.log(`Try to end a connection: ${connection.host} / ${connection.port}`);
		connection.end();
	}
}

module.exports = new BeanstalkConnectionManager();
