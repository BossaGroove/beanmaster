'use strict';

const coExpress = require('co-express');

/**
 *
 * abstract controller
 * @constructor
 */
class AbstractController {
	action(action) {
		if (this[action]) {
			return coExpress(this[action].bind(this));
		}

		throw new Error('No action "' + action + '" in controller "' + this.constructor.name + '"');
	}
}

module.exports = AbstractController;
