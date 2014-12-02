/**
 * Created by Bossa on 2014/10/05.
 */

(function() {
	'use strict';

	var fs = require('fs');
	var _ = require('lodash');
	var Fivebeans = require('fivebeans');

	function BeanstalkConnectionManager() {
		this._connection = null;
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

		var reinit = false;

		if (this._connection) {
			if (this._connection.host !== host ||
				this._connection.port !== port) {
				reinit = true;
				this._connection.end();
				//console.log('exist connection but host or port is different');
			} else {
				//console.log('exist connection');
			}
		} else {
			reinit = true;
			//console.log('no connection at all');
		}

		if (!reinit) {
			callbackWrapper(null, this._connection);
		} else {
			this._connection = new Fivebeans.client(host, port);

			this._connection
				.on('connect', function() {
					console.log('connect successful');
					callbackWrapper(null, _this._connection);
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
