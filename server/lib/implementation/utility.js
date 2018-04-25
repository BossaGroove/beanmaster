/**
 * Created by Bossa on 10/12/14.
 */


const path = require('path');

class Utility {
	static getHomePath() {
		let beanmasterHomePath = '';

		if (process.env.BEANMASTER_HOME) {
			beanmasterHomePath = process.env.BEANMASTER_HOME;
		} else {
			beanmasterHomePath = path.resolve(process.env.HOME || process.env.HOMEPATH, '.beanmaster');
		}

		return beanmasterHomePath;
	}
}

module.exports = Utility;
