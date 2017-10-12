'use strict';

const _ = require('lodash');

class DataAdapter {
	/**
	 * Get data from request and return an App object
	 */
	getData() {
		return null;
	}

	_setValue(obj, property, val) {
		if (!_.isUndefined(val) && val !== null) {
			if (_.isString(val)) {
				obj[property] = val.trim(); // trim spaces from query param values
			} else {
				obj[property] = val;
			}
		}
	}
}

module.exports = DataAdapter;
