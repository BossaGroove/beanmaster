module.exports = function (app, passport) {

	var home = require('../../app/controllers/home');

	// home route
	app.get('/', home.servers);
	app.post('/add-server', home.addServer);
	app.post('/delete-server', home.deleteServer);

	var server = require('../../app/controllers/server');

	app.get('/:host_port', server.listTube);
	app.get('/:host_port/:tube', server.tube);

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