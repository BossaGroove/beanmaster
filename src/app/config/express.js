/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var morgan = require('morgan');

var flash = require('connect-flash');
var config = require('./config');

var env = process.env.NODE_ENV || 'development';

var view_helpers = require('./middlewares/view');

/**
 * Expose
 */

module.exports = function (app) {

	// Compression middleware (should be placed before express.static)
	app.use(compression({
		threshold: 512
	}));

	// Static files middleware
	app.use(express.static(config.root + '/public'));

	// set views path, template engine and default layout
	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');

	app.set('showStackError', true);

	app.use(morgan('dev'));

	// bodyParser should be above methodOverride
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	app.use(methodOverride(function (req) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	}));

	// CookieParser should be above session
	app.use(cookieParser());
	app.use(cookieSession({secret: 'secret'}));
	app.use(session({
		secret: 'srhgisrjhprgoszrdtujhgsedhtijw489tyh0(#Hj4iho2rl;t467)%2',
		resave: false,
		saveUninitialized: true
	}));

	// connect flash for flash messages - should be declared after sessions
	app.use(flash());

	app.use(require('connect-assets')({
		paths: [config.root + 'app/assets'],
		servePath: 'assets'
	}));

	app.use(require('less-middleware')(config.root + '/public'));

	app.use(csrf());

	app.use(view_helpers(config));

	app.disable('x-powered-by');

	app.locals.pretty = (env !== 'production');

	app.use(function (req, res, next) {
		res.locals.csrf_token = req.csrfToken();
		next();
	});
};
