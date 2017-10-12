/**
 * Created by Bossa on 2014/10/05.
 */

'use strict';

const Fivebeans = require('fivebeans');
const coTimeout = require('co-timeout');
const coEvent = require('co-event');
const bluebird = require('bluebird');

class BeanstalkConnectionManager {
	constructor() {
		this._connections = {};
	}

	async getConnection(host, port) {
		if (!host || !port) {
			throw new Error('Host or port invalid');
		}

		port = parseInt(port, 10);

		let connection_key = host + ':' + port;

		if (this._connections[connection_key]) {
			return this._connections[connection_key];
		}

		this._connections[connection_key] = await this.connectServer(host, port);

		this._connections[connection_key]
			.on('error', this.errorHandler('error', connection_key))
			.on('close', this.errorHandler('close', connection_key));

		return this._connections[connection_key];
	}

	removeConnection(host, port) {
		let connection_key = host + ':' + port;
		if (this._connections[connection_key]) {
			this._connections[connection_key] = null;
		}
	}

	async connectServer(host, port) {
		console.log('Try to initiate a new beanstalk connection: ' + host + ' / ' + port);

		let client = new Fivebeans.client(host, port);

		bluebird.promisifyAll(client, {
			multiArgs: true
		});

		client.connect();

		await coTimeout(10000, async function () {
			let events = true;
			while (events) {
				let e = await coEvent(client);
				switch (e.type) {
					case 'connect':
						console.log(`Beanstalkd ${host}:${port} connected successfully`);
						events = false;
						return;
					case 'close':
						break;
					case 'error':
						break;
					default:
						break;
				}
			}
		});

		return client;
	}

	errorHandler(event, connection_key) {
		return (function (err) {
			console.log(`Beanstalkd ${connection_key} ${event}, err: ${err}`);
			this._connections[connection_key] = null;
		}).bind(this);
	}
}

module.exports = new BeanstalkConnectionManager();
