const {ResponseManager} = require('../lib');

module.exports = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		// will only respond with JSON
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = ResponseManager.error({
			stack: err.stack
		}, ctx.status, err.message);
	}
};
