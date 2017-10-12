'use strict';

const _ = require('lodash');

/**
 *
 * abstract controller
 * @constructor
 */
class AbstractController {
	action(action) {
		if (this[action]) {
			// return coExpress(this[action].bind(this));
			return this[action].bind(this);
		}

		throw new Error('No action "' + action + '" in controller "' + this.constructor.name + '"');
	}

	/**
	 * Attach dependencies for this controller. E.g. RequestAdapters and Validators
	 * @param request_handlers
	 * @param default_handlers
	 */
	wireEndpointDependencies(request_handlers, default_handlers) {
		const handlers = request_handlers || default_handlers;

		_.forOwn(handlers, (handler, handler_id) => {
			if (_.isString(handler_id)) {
				// convert handler name tp _handlerName format. E.g. DataAdapter -> _dataAdapter
				const handlerName = handler_id.charAt(0).toLowerCase() + handler_id.slice(1);

				// attach the handler to the Controller instance
				this[`_${handlerName}`] = handler;
			}
		});
	}
}

module.exports = AbstractController;
