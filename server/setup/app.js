const path = require('path');
const Koa = require('koa');
const helmet = require('koa-helmet');
const responseTime = require('koa-response-time');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const serve = require('koa-static');
const viewMiddleware = require('../middlewares/view');
const errorHandler = require('../middlewares/error_handler');

const router = require('../route');

const ENV = process.env.NODE_ENV || 'development';

const app = new Koa();

app.context.env = ENV;

if (ENV === 'production') {
	app.use(serve(`${__dirname}/../../public`));
}

app.use(helmet({
	contentSecurityPolicy: false,
	hsts: false,
	expectCt: false
}));
app.use(responseTime());
app.use(logger());
app.use(bodyParser());

app.use(views(path.resolve(__dirname, '../views'), {
	extension: 'pug'
}));

app.use(viewMiddleware());

app.use(errorHandler);
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
