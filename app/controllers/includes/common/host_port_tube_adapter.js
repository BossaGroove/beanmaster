'use strict';

const _ = require('lodash');
const DataAdapter = require('../data_adapter');

class HostPortTubeAdapter extends DataAdapter {
	/**
	 * Get data from request and return an App object
	 * @param req
	 */
	getData(req) {
		const data = {};

		const host_port = _.get(req, 'params.host_port').split(':');
		if (host_port.length === 2) {
			[data.host, data.port] = host_port;
			data.port = parseInt(data.port, 10);
		}

		this._setValue(data, 'tube', _.get(req, 'params.tube'));

		return data;
	}
}

module.exports = HostPortTubeAdapter;
