'use strict';

/**
 * Created by Bossa on 27/1/15.
 */

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
