/**
 * Created by Bossa on 2014/10/05.
 */

(function() {
	'use strict';

	var fs = require('fs');
	var _ = require('lodash');
	var Fivebeans = require('fivebeans');

	function BeanstalkConnectionManager() {
		this._connections = {};
	}

	BeanstalkConnectionManager.prototype.getConnection = function(host, port, callback) {

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
			this._connections[connection_key] = new Fivebeans.client(host, port);

			this._connections[connection_key]
				.on('connect', function() {
					console.log('connect successful');
					callbackWrapper(null, _this._connections[connection_key]);
				})
				.on('error', function(err) {
					console.log('connect err: ' + err);
					callbackWrapper(err, null);
				})
				.on('close', function() {
					console.log('beanstalk connection closed');
				})
				.connect();
		}
	};


	BeanstalkConnectionManager.instance = null;

	BeanstalkConnectionManager.getInstance = function() {
		if (this.instance === null) {
			this.instance = new BeanstalkConnectionManager();
		}
		return this.instance;
	};

	module.exports = BeanstalkConnectionManager.getInstance();

})();
