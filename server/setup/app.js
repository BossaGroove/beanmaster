const Koa = require('koa');
const helmet = require('koa-helmet');
const responseTime = require('koa-response-time');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const Csrf = require('koa-csrf');
const views = require('koa-views');

const router = require('../route');

const ENV = process.env.NODE_ENV || 'development';

const app = new Koa();

app.context.env = ENV;
app.use(helmet());
app.use(responseTime());
app.use(logger());
app.use(bodyParser());
app.use(new Csrf());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
