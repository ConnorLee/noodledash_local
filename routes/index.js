
/*
 * GET home page.
 */


exports.iframe = function(req, res){
        referenceurl = 'http://www.trackerstorymaps.com/projects/679513/releases';

        pagename = req.params.page;

        if (pagename == 'engagement') {
                referenceurl = 'https://www.leftronic.com/app/#9ztWYx/4EhDI4sYl';
        }

        if (pagename == 'snt') {
                referenceurl = 'http://www.trackerstorymaps.com/projects/187421/releases';
        }

        if (pagename == 'jedis') {
                referenceurl = 'http://www.trackerstorymaps.com/projects/305603/releases';
        }

        res.render('iframe', {
        title: 'Noodle',
        pagename: 'manual',
        referencesite: referenceurl,
		user: req.user
        });
};


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

exports.tools = function(req, res){

	res.render('tools', {
	title: 'Our Tools',
	pagename: 'tools',
	user: req.user
	});
};






