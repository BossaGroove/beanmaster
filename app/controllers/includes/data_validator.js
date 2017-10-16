'use strict';

class DataValidator {
	/**
	 * Validates data
	 */
	validate() {
		return true;
	}

	failWith(message) {
		throw new Error(message);
	}
}

module.exports = DataValidator;
