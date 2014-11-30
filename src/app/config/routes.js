/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

//var auth = require('./middlewares/authorization');

/**
 * Expose routes
 */

module.exports = function (app, passport) {

	var home = require('../../app/controllers/home');

	// home route
	app.get('/', home.home);
	app.post('/add-server', home.addServer);

	/**
	 * Error handling
	 */

	/*app.use(function (err, req, res, next) {
		// treat as 404
		if (err.message
			&& (~err.message.indexOf('not found')
			|| (~err.message.indexOf('Cast to ObjectId failed')))) {
			return next();
		}
		console.error(err.stack);
		// error page
		res.status(500).render('500', {error: err.stack});
	});

	// assume 404 since no middleware responded
	app.use(function (req, res, next) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});*/
};