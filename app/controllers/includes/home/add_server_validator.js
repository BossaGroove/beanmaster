'use strict';

const _ = require('lodash');
const DataValidator = require('../data_validator');

class AddServerValidator extends DataValidator {
	/**
	 * Validates request app data.
	 * @param data
	 * @returns {boolean}
	 */
	validate(data) {
		if (_.isEmpty(_.get(data, 'name'))) {
			this.failWith('name is invalid');
		}

		if (_.isEmpty(_.get(data, 'host'))) {
			this.failWith('host is invalid');
		}

		if (!_.isNumber(_.get(data, 'port'))) {
			this.failWith('port is invalid');
		}

		if (data.port < 1 || data.port > 65535) {
			this.failWith('port number must be within 1 and 65535');
		}
	}
}

module.exports = AddServerValidator;
