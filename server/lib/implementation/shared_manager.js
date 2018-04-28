const bunyan = require('bunyan');

class SharedManager {
	constructor() {
		this.logger = bunyan.createLogger({
			name: 'beanmaster-react',
			level: 'info'
		});

		this.app = null;
	}
}

module.exports = new SharedManager();
