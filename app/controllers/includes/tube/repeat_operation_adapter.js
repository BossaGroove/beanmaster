'use strict';

const _ = require('lodash');
const DataAdapter = require('../data_adapter');
const HostPortTubeAdapter = require('../common/host_port_tube_adapter');
const host_port_tube_adapter = new HostPortTubeAdapter();

class RepeatOperationAdapter extends DataAdapter {
	/**
	 * Get data from request and return an App object
	 * @param req
	 */
	getData(req) {
		const data = host_port_tube_adapter.getData(req);

		this._setValue(data, 'value', parseInt(_.get(req, 'body.value'), 10));

		if (!_.isFinite(data.value)) {
			data.value = 1;
		}

		return data;
	}
}

module.exports = RepeatOperationAdapter;
