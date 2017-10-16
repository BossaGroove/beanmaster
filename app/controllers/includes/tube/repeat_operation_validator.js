'use strict';

const DataValidator = require('../data_validator');
const HostPortValidator = require('../common/host_port_validator');
const host_port_validator = new HostPortValidator();

class RepeatOperationValidator extends DataValidator {
	/**
	 * Validates request app data.
	 * @param data
	 * @returns {boolean}
	 */
	validate(data) {
		host_port_validator.validate(data);
	}
}

module.exports = RepeatOperationValidator;
