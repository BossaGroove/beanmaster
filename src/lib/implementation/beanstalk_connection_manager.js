/**
 * Created by Bossa on 2014/10/05.
 */

'use strict';

const _ = require('lodash');
const Fivebeans = require('fivebeans');

class BeanstalkConnectionManager {
	constructor() {
		this._connections = {};
	}

	* getConnection(host, port) {
		if (!host || !port) {
			throw new Error('Host or port invalid');
		}

		port = parseInt(port, 10);

		let connection_key = host + ':' + port;

		if (this._connections[connection_key]) {
			return this._connections[connection_key];
		}

		this._connections[connection_key] = yield this.connectServer(host, port);

		return this._connections[connection_key];
	}

	* connectServer(host, port) {
		console.log('Try to initiate a new beanstalk connection: ' + host + ' / ' + port);

		let client = new Fivebeans.client(host, port);

		client.connect();

		yield (new Promise(function (resolve, reject) {
			let callback_count = 0;
			let callbackWrapper = function(err) {
				callback_count++;
				if (callback_count <= 1) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				}
			};

			let timeout_handler = setTimeout(function () {
				console.log('Beanstalkd connection timeout');
				callbackWrapper('timeout');
			}, 10000);

			client
				.on('connect', function () {
					clearTimeout(timeout_handler);
					console.log('Beanstalkd connected successfully');
					callbackWrapper();
				})
				.on('error', function (err) {
					clearTimeout(timeout_handler);
					console.log('Beanstalkd connect failed: ' + err);
					callbackWrapper(err);
				})
				.on('close', function () {
					clearTimeout(timeout_handler);
					console.log('Beanstalkd connection closed');
				});
		}));

		return client;
	}

}

module.exports = new BeanstalkConnectionManager();
