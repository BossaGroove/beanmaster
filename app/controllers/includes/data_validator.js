'use strict';

const _ = require('lodash');

class DataValidator {
	/**
	 * Validates data
	 * @param data
	 */
	validate(data) {
		return true;
	}

	failWith(message) {
		throw new Error(message);
	}
}

module.exports = DataValidator;
