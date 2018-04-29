function view() {
	return function views(ctx, next) {
		ctx.locals = {
			manifest: require('../../public/manifest.json')
		};
		return next();
	};
}

module.exports = view;
