
/*
 * GET home page.
 */

exports.main = function(req, res){

	res.render('main', {
	title: 'Noodle',
	pagename: 'home'
	});
};

exports.index = function(req, res){

	referenceurl = '';

	releasename = req.params.release;

	if (releasename == 'backlog') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/679513/releases';
	}
	
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
	referencesite: referenceurl,
	pagename: 'iframe'
	});
};




