
/*
 * GET home page.
 */

exports.manual = function(req, res){
	res.render('employee-manual', {
	title: 'Noodle Employee Manual',
	pagename: 'manual',
	user: req.user
	});
};

exports.resources = function(req, res){
	res.render('resources', {
	title: 'Noodle Resources',
	pagename: 'resources',
	user: req.user
	});
};

exports.main = function(req, res){

	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
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
	user: req.user,
	pagename: 'iframe'
	});
};




