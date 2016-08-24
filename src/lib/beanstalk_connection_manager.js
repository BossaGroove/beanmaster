/**
 * Created by Bossa on 2014/10/05.
 */

'use strict';

const Fivebeans = require('fivebeans');

class BeanstalkConnectionManager {
	constructor() {
		this._connections = {};	
	}

	getConnection(host, port, callback) {
		if (!host || !port) {
			callback('Host or port invalid', null);
		} else {
			var callback_count = 0;

			var callbackWrapper = function(err, connection) {
				callback_count++;
				if (callback_count <= 1) {
					callback(err, connection);
				}
			};

			var _this = this;

			port = parseInt(port);

			var connection_key = host + ':' + port;

			if (this._connections[connection_key]) {
				callbackWrapper(null, this._connections[connection_key]);
			} else {
				console.log('Try to initiate a new beanstalk connection: ' + host + ' / ' + port);

				this._connections[connection_key] = new Fivebeans.client(host, port);

				var timeout_handler = setTimeout(function() {
					_this._connections[connection_key] = null;
					console.log('Beanstalkd connection timeout');
					callbackWrapper('Connection timeout', null);
				}, 10000);

				this._connections[connection_key]
					.on('connect', function() {
						clearTimeout(timeout_handler);
						console.log('Beanstalkd connected successfully');
						callbackWrapper(null, _this._connections[connection_key]);
					})
					.on('error', function(err) {
						clearTimeout(timeout_handler);
						console.log('Beanstalkd connect failed: ' + err);
						_this._connections[connection_key] = null;
						callbackWrapper(err.toString(), null);
					})
					.on('close', function() {
						clearTimeout(timeout_handler);
						console.log('Beanstalkd connection closed');
						_this._connections[connection_key] = null;
					})
					.connect();
			}
		}
	}
}

module.exports = new BeanstalkConnectionManager();
