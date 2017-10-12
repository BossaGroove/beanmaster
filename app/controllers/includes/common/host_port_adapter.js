'use strict';

const _ = require('lodash');
const DataAdapter = require('../data_adapter');

class HostPortAdapter extends DataAdapter {
	/**
	 * Get data from request and return an App object
	 * @param req
	 */
	getData(req) {
		let data = {};

		this._setValue(data, 'host', _.get(req, 'query.host'));
		this._setValue(data, 'port', parseInt(_.get(req, 'query.port'), 10));

		return data;
	}
}

module.exports = HostPortAdapter;
