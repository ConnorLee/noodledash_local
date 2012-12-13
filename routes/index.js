
/*
 * GET home page.
 */

exports.index = function(req, res){
	referenceurl = 'http://www.trackerstorymaps.com/projects/679513/releases';

	releasename = req.params.release;

	if (releasename == 'pnp') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/187445/releases';
	}

	if (releasename == 'snt') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/187421/releases';
	}

	if (releasename == 'jedis') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/305603/releases';
	}

	res.render('iframe', {
	title: 'Noodle',
	referencesite: referenceurl
	});
};


