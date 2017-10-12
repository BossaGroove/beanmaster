'use strict';

const app_root = `${__dirname}/../..`;
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const morgan = require('morgan');
const flash = require('connect-flash');
const config = require(`${app_root}/config`);
const viewHelpers = require('../middlewares/view');
const errorHandler = require('../middlewares/error_handler');
const router = require('./routes');

const env = process.env.NODE_ENV || 'development';

const app = express();

// Compression middleware (should be placed before express.static)
app.use(compression({
	threshold: 512
}));

// Static files middleware
app.use(express.static(`${app_root}/public`));

// set views path, template engine and default layout
app.set('views', `${app_root}/app/views`);
app.set('view engine', 'jade');

app.set('showStackError', true);

app.use(morgan('dev'));

// bodyParser should be above methodOverride
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// CookieParser should be above session
app.use(cookieParser());

app.use(cookieSession({
	secret: 'srhgisrjhprgoszrdtujhgsedhtijw489tyh0(#Hj4iho2rl;t467)%2'
}));

// connect flash for flash messages - should be declared after sessions
app.use(flash());

app.use(require('connect-assets')({
	paths: [`${app_root}/app/assets`],
	servePath: 'assets'
}));

app.use(require('less-middleware')(`${app_root}/public`));

app.use(csrf());

app.disable('x-powered-by');

app.locals.pretty = (env !== 'production');

// view helper
app.use(viewHelpers(config));

// router
app.use('/', router);

app.use(errorHandler);

module.exports = app;
