'use strict';

const _ = require('lodash');
const DataValidator = require('../data_validator');
const HostPortTubeValidator = require('../common/host_port_tube_validator');
const host_port_tube_validator = new HostPortTubeValidator();

class AddJobValidator extends DataValidator {
	/**
	 * Validates request app data.
	 * @param data
	 * @returns {boolean}
	 */
	validate(data) {
		host_port_tube_validator.validate(data);

		if (_.isEmpty(_.get(data, 'tube_name'))) {
			this.failWith('tube_name is empty');
		}

		if (!_.isFinite(_.get(data, 'priority'))) {
			this.failWith('priority is not a number');
		}

		if (!_.isFinite(_.get(data, 'delay'))) {
			this.failWith('delay is not a number');
		}

		if (!_.isFinite(_.get(data, 'ttr'))) {
			this.failWith('ttr is not a number');
		}

		if (_.isEmpty(_.get(data, 'payload'))) {
			this.failWith('payload is empty');
		}
	}
}

module.exports = AddJobValidator;
