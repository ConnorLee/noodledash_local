
/*
 * GET home page.
 */


exports.iframe = function(req, res){

        pagename = req.params.page;

        if (pagename == 'executive') {
                referenceurl = 'https://www.leftronic.com/app/#KjsGig/d2xhZkl9DoSBINA';
        }
        if (pagename == 'performance') {
                referenceurl = 'https://www.leftronic.com/share/Ulh0hO';
        }
         if (pagename == 'marketing') {
                referenceurl = 'https://www.leftronic.com/share/GetI9h/#GetI9h' ;
        }
        if (pagename == 'engagement') {
                referenceurl = 'https://www.leftronic.com/share/9ztWYx/#9ztWYx';
        }
         if (pagename == 'tools') {
                referenceurl = '../views/tools.ejs';
        }
        if (pagename == 'ppt') {
                referenceurl = '../views/ppt.ejs';
        }
        if (pagename == 'about') {
                referenceurl = '../views/about.ejs';
        }
         if (pagename == 'brandguide') {
                referenceurl = '../assets/Noodle_BrandGuide.pdf';
        }
         if (pagename == 'handbook') {
                referenceurl = '';
        }
        if (pagename == 'social') {
                referenceurl = '../views/social.ejs';
        } 
        if (pagename == 'explore') {
                referenceurl = 'http://explore.noodle.org/';
        }
         if (pagename == 'chelsea-piers') {
                referenceurl = '';
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

exports.ppt = function(req, res){

    res.render('ppt', {
    title: 'PowerPoint Template',
    pagename: 'ppt',
    user: req.user
    });
};


exports.about = function(req, res){

    res.render('about', {
    title: 'About Our Tools',
    pagename: 'about',
    user: req.user
    });
};

exports.social = function(req, res){

    res.render('social', {
    title: 'Social Dashboard',
    pagename: 'social',
    user: req.user
    });
};



