'use strict';

module.exports = function (config) {
	return function (req, res, next) {
		res.locals.title = res.locals.title || config.title;
		res.locals.keywords = res.locals.keywords || config.keywords;
		res.locals.description = res.locals.description || config.description;

		// CSRF support
		res.locals._csrf = req.csrfToken();
		next();
	};
};
