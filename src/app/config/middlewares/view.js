module.exports = function (config) {
	return function (req, res, next) {
		res.locals.title = res.locals.title || config.title;
		res.locals.keywords = res.locals.keywords || config.keywords;
		res.locals.description = res.locals.description || config.description;

		//res.locals.env = env = process.env.NODE_ENV || 'development'; // use in jade view

		// to check if user login
		//res.locals.user = req.user;

		// CSRF support
		res.locals._csrf = req.csrfToken();
		next();
	};
};