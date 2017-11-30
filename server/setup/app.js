const Koa = require('koa');
const helmet = require('koa-helmet');
const responseTime = require('koa-response-time');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');

const viewMiddleware = require('../middlewares/view');
const router = require('../route');

const ENV = process.env.NODE_ENV || 'development';

const app = new Koa();

app.context.env = ENV;

// if (config.app.env === "production") {
// 	app.use(serve(path.join(config.app.root, "build", "public"), SERVE_OPTIONS, STATIC_FILES_MAP));
// } else {
// app.use(proxy({
// 	host: 'http://localhost:4003',
// 	match: /\.(js|woff|woff2|ttf|eot|json)$/,
// }));
// }

// if (ENV === 'development') {
// 	const webpack = require('webpack');
// 	const webpackConfig = require('../../webpack.config');
// 	const compiler = webpack(webpackConfig);
// 	app.use(require('koa-webpack-dev-middleware')(compiler, {
// 		hot: true,
// 		// noInfo: true,
// 		publicPath: webpackConfig.output.publicPath,
// 		quiet: false,
// 		// stats: 'errors-only' // to config stats, pls refer https://webpack.github.io/docs/node.js-api.html#stats
// 		stats: {
// 			colors: true,
// 			modules: false
// 		}
// 	}));
// 	app.use(require('koa-webpack-hot-middleware')(compiler));
// }

app.use(helmet());
app.use(responseTime());
app.use(logger());
app.use(bodyParser());

app.use(views(__dirname + '/../views', {
	extension: 'pug'
}));

app.use(viewMiddleware());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
