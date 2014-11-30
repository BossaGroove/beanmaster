/**
 * Created by Bossa on 2014/11/30.
 */

exports.home = function(req, res) {
	res.render('pages/servers', {
		page: 'Servers',
		title: 'Servers'
	});
};
