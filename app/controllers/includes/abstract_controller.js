'use strict';

const coExpress = require('co-express');
const _ = require('lodash');

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

	/**
	 * Attach dependencies for this controller. E.g. RequestAdapters and Validators
	 * @param request_handlers
	 * @param default_handlers
	 */
	wireEndpointDependencies(request_handlers, default_handlers) {
		let _this = this;
		let handlers = request_handlers || default_handlers;

		_.forOwn(handlers, function (handler, handler_id) {
			if (_.isString(handler_id)) {
				// convert handler name tp _handlerName format. E.g. DataAdapter -> _dataAdapter
				let handlerName = handler_id.charAt(0).toLowerCase() + handler_id.slice(1);

				// attach the handler to the Controller instance
				_this[`_${handlerName}`] = handler;
			}
		});
	}
}

module.exports = AbstractController;
