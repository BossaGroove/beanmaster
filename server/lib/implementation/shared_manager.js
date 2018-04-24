

class SharedManager {
	constructor() {
		const fakeLogger = function (msg) {
			console.log(msg);
		};

		this.logger = {
			trace: fakeLogger,
			info: fakeLogger,
			debug: fakeLogger,
			fatal: fakeLogger,
			warn: fakeLogger
		};

		this.app = null;
	}
}

module.exports = new SharedManager();
