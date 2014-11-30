/*!
 * Module dependencies.
*/

var DatabaseManager = require('nodejs-lib').DatabaseManager;
var User = DatabaseManager.mongoose.main.model('User');
var local = require('./passport/local');

/**
 * Expose
 */

module.exports = function (passport) {
	// serialize sessions
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User
			.findOne({ _id: id })
			.exec(function(err, user) {
				done(err, user);
			});
	});

	// use these strategies
	// Use local strategy
	passport.use('local', local);

};
