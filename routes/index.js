
/*
 * GET home page.
 */


exports.iframe = function(req, res){

        pagename = req.params.page;
        conditionalclasses = " ";
        // navlink = " ";

        if (pagename == 'main') {
             conditionalclasses == "show-welcome";
             // navlink == "main"; 
        }
        if (pagename == 'ppt') {
                referenceurl == '../views/ppt.ejs';
                // navlink == "ppt"; 
        }
        if (pagename == 'about') {
                referenceurl == '../views/about.ejs';
                // navlink == "about";
        }
         if (pagename == 'brandguide') {
                referenceurl == '../assets/Noodle_BrandGuide.pdf';
                // navlink == "brandguide";
        }
        if (pagename == 'social') {
                referenceurl == '../views/social.ejs';
                // navlink == "social";
        } 
        if (pagename == 'explore') {
                referenceurl == 'http://explore.noodle.org/';
                // navlink == "explore";
        }
         if (pagename == 'class-schedule') {
                referenceurl == 'http://www.chelseapiers.com/sc/downloads/FitnessSchedules/2014/SC_Classes201401.pdf#page=2';
                // navlink == "class-schedule";
        }
        if (pagename == 'tools') {
                referenceurl == '../views/tools.ejs';
                // navlink == "tools";
        } 
    
        //SLACK ROUTES//
         
        if (pagename == 'team-board') {
                referenceurl == 'https://noodle.slack.com/messages/general/files/';
               conditionalclasses ==  "slacksite";
               // navlink == "team-board";
        }    
        if (pagename == 'marketing-board') {
                referenceurl == 'https://noodle.slack.com/messages/marketing/files/';
               conditionalclasses ==  "slacksite";
               // navlink == "marketing-board";
        }    
          if (pagename == 'product-board') {
                referenceurl == 'https://noodle.slack.com/messages/product/files/';
                conditionalclasses ==  "slacksite";
                // navlink == "product-board";
        }    
          if (pagename == 'engagement-board') {
                referenceurl == 'https://noodle.slack.com/messages/engagement/files/';
                conditionalclasses ==  "slacksite";
                // navlink == "engagement-board";
        }    
          if (pagename == 'dev-board') {
                referenceurl == 'https://noodle.slack.com/messages/deploy/files/';
                conditionalclasses ==  "slacksite";
                // navlink == "dev-board";
        }      
          if (pagename == 'rev-board') {
                referenceurl = 'https://noodle.slack.com/messages/revenue/files/';
                conditionalclasses =  "slacksite";
                // navlink == "rev-board";
        }    
          if (pagename == 'search-board') {
                referenceurl == 'https://noodle.slack.com/messages/search/files/';
                conditionalclasses ==  "slacksite";
                // navlink == "search-board";
        }    
        if (pagename == 'search-random') {
                referenceurl == 'https://noodle.slack.com/messages/random/files/';
                conditionalclasses ==  "slacksite";
                // navlink == "search-random";
        }    

        //LEFTRONIC ROUTES//

         if (pagename == 'executive') {
                 referenceurl == 'https://www.leftronic.com/share/GetI9h/#GetI9h';
                 conditionalclasses ==  "leftronics";
                 conditionalclasses == "show-password";
                 // navlink == "executive";
         } 
         if (pagename == 'performance') {
                 referenceurl = 'https://www.leftronic.com/share/Ulh0hO';
                 conditionalclasses ==  "leftronics";
                 conditionalclasses == "show-password";
                 // navlink == "performance";

         }
          if (pagename == 'marketing') {
                 referenceurl == 'https://www.leftronic.com/share/GetI9h/#GetI9h' ;
                 conditionalclasses ==  "leftronics";
                 conditionalclasses == "show-password";
                 // navlink =="marketing";
         }
         if (pagename == 'engagement') {
                 referenceurl == 'https://www.leftronic.com/share/9ztWYx/#9ztWYx';
                 conditionalclasses ==  "leftronics";
                 conditionalclasses == "show-password";
                 // navlink == "engagement";
         }

        res.render('iframe', {
        title: 'Noodle',
        pagename: 'manual',
        conditionalclasses: conditionalclasses,
        // modalroute: modal,
        // navlink: navlink,
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



