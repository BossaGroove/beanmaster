'use strict';

const _ = require('lodash');
const DataAdapter = require('../data_adapter');
const HostPortTubeAdapter = require('../common/host_port_tube_adapter');
const host_port_tube_adapter = new HostPortTubeAdapter();

class JobIdAdapter extends DataAdapter {
	/**
	 * Get data from request and return an App object
	 * @param req
	 */
	getData(req) {
		const data = host_port_tube_adapter.getData(req);

		this._setValue(data, 'job_id', parseInt(_.get(req, 'body.job_id'), 10));

		return data;
	}
}

module.exports = JobIdAdapter;
