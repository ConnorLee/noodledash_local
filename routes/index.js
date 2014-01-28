
/*
 * GET home page.
 */


exports.iframe = function(req, res){

        pagename = req.params.page;

        if (pagename == 'engagement') {
                referenceurl = 'https://www.leftronic.com/app/#9ztWYx/4EhDI4sYl';
        }
        if (pagename == 'executive') {
                referenceurl = 'https://www.leftronic.com/app/#Ulh0hO/4EhDI4sYl';
        }
        if (pagename == 'performance') {
                referenceurl = 'https://www.leftronic.com/app/#Ulh0hO/4EhDI4sYl';
        }
         if (pagename == 'marketing') {
                referenceurl = 'https://www.leftronic.com/app/#GetI9h/4EhDI4sYl';
        }
         if (pagename == 'brand-guide') {
                referenceurl = 'docs/BrandGuide.pdf';
        }
         if (pagename == 'news-room') {
                referenceurl = 'http://www.chelseapiers.com/cpblog/';
        }
         if (pagename == 'class-schedule') {
                referenceurl = 'http://www.chelseapiers.com/sc/downloads/FitnessSchedules/2014/SC_Classes201401.pdf#page=2';
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






