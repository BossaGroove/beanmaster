/**
 * Created by Bossa on 2014/10/05.
 */

'use strict';

const _ = require('lodash');
const coEvent = require('co-event');
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
	}

	* connectServer(host, port) {
		console.log('Try to initiate a new beanstalk connection: ' + host + ' / ' + port);

		let client = new Fivebeans.client(host, port);

		client.connect();

		let e;

		while (e = yield coEvent(client)) {
			switch (e.type) {
				case 'connect':
					console.log('Beanstalkd connected successfully');
					break;
				case 'error':
					console.log('Beanstalkd connect failed');
					break;
				case 'close':
					console.log('Beanstalkd connection closed');
					break;
			}
		}

		console.log('END');

		return client;
			/*

		yield (new Promise(function (resolve, reject) {
			let timeout_handler = setTimeout(function () {
				console.log('Beanstalkd connection timeout');

			}, 10000);

			client
				.on('connect', function () {
					clearTimeout(timeout_handler);
					console.log('Beanstalkd connected successfully');
					callbackWrapper(null, _this._connections[connection_key]);
				})
				.on('error', function (err) {
					clearTimeout(timeout_handler);
					console.log('Beanstalkd connect failed: ' + err);
					_this._connections[connection_key] = null;
					callbackWrapper(err.toString(), null);
				})
				.on('close', function () {
					clearTimeout(timeout_handler);
					console.log('Beanstalkd connection closed');
					_this._connections[connection_key] = null;
				})
				.connect();
		}));*/
	}

}

module.exports = new BeanstalkConnectionManager();
