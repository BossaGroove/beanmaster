'use strict';

const _ = require('lodash');
const HostPortValidator = require('./host_port_validator');

class HostPortTubeValidator extends HostPortValidator {
	/**
	 * Validates request app data.
	 * @param data
	 * @returns {boolean}
	 */
	validate(data) {
		super.validate(data);
		if (_.isEmpty(_.get(data, 'tube'))) {
			this.failWith('tube is invalid');
		}
	}
}

module.exports = HostPortTubeValidator;
