/**
 * Created by Bossa on 10/12/14.
 */


const path = require('path');

class Utility {
	static getHomePath() {
		let beanmaster_home_path = '';

		if (process.env.BEANMASTER_HOME) {
			beanmaster_home_path = process.env.BEANMASTER_HOME;
		} else {
			beanmaster_home_path = path.resolve(process.env.HOME || process.env.HOMEPATH, '.beanmaster');
		}

		return beanmaster_home_path;
	}
}

module.exports = Utility;
