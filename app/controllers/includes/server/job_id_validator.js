'use strict';

const _ = require('lodash');
const DataValidator = require('../data_validator');
const HostPortValidator = require('../common/host_port_validator');
const host_port_validator = new HostPortValidator();

class JobIdValidator extends DataValidator {
	/**
	 * Validates request app data.
	 * @param data
	 * @returns {boolean}
	 */
	validate(data) {
		host_port_validator.validate(data);

		if (!_.isFinite(_.get(data, 'job_id'))) {
			this.failWith('job_id is not a number');
		}
	}
}

module.exports = JobIdValidator;
