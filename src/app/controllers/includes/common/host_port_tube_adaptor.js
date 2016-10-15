'use strict';

const _ = require('lodash');
const DataAdapter = require('../data_adapter');

class HostPortAdaptor extends DataAdapter {
	/**
	 * Get data from request and return an App object
	 * @param req
	 */
	getData(req) {
		let data = {};

		let host_port = _.get(req, 'params.host_port');
		host_port = host_port.split(':');
		if (host_port.length === 2) {
			data.host = host_port[0];
			data.port = parseInt(host_port[1], 10);
		}

		this._setValue(data, 'tube', _.get(req, 'params.tube'));

		return data;
	}
}

module.exports = HostPortAdaptor;
