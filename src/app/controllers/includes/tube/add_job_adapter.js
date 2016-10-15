'use strict';

const _ = require('lodash');
const DataAdapter = require('../data_adapter');
const HostPortTubeAdapter = require('../common/host_port_tube_adapter');
const host_port_tube_adapter = new HostPortTubeAdapter();

class AddJobAdapter extends DataAdapter {
	/**
	 * Get data from request and return an App object
	 * @param req
	 */
	getData(req) {
		let data = host_port_tube_adapter.getData(req);

		this._setValue(data, 'tube_name', _.get(req, 'body.tube_name'));
		this._setValue(data, 'priority', parseInt(_.get(req, 'body.priority'), 10));
		this._setValue(data, 'delay', parseInt(_.get(req, 'body.delay'), 10));
		this._setValue(data, 'ttr', parseInt(_.get(req, 'body.ttr'), 10));
		this._setValue(data, 'payload', _.get(req, 'body.payload'));

		if (!_.isFinite(data.priority)) {
			data.priority = 0;
		}
		if (!_.isFinite(data.delay)) {
			data.delay = 0;
		}
		if (!_.isFinite(data.ttr)) {
			data.ttr = 0;
		}

		return data;
	}
}

module.exports = AddJobAdapter;