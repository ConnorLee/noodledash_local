
/*
 * GET home page.
 */

exports.iframe = function(req, res){

        pagename = req.params.page;
        conditionalclasses = " ";
        modal = " ";

        if (pagename == 'ppt') {
                referenceurl = '../views/ppt.ejs';
        }
        if (pagename == 'about') {
                referenceurl = '../views/about.ejs';
        }
        if (pagename == 'brandguide') {
                referenceurl = '../assets/Noodle_BrandGuide.pdf';
        }
        if (pagename == 'social') {
                referenceurl = '../views/social.ejs';
        } 
        if (pagename == 'explore') {
                referenceurl = 'http://explore.noodle.org/';
        }
        if (pagename == 'class-schedule') {
                referenceurl = 'http://www.chelseapiers.com/sc/downloads/FitnessSchedules/2014/SC_Classes201401.pdf#page=2';
        }
        if (pagename == 'tools') {
                referenceurl = '../views/tools.ejs';
        } 
        if (pagename == 'home') {
                referenceurl = '../views/home.ejs';
        } 
        if (pagename == 'analyticsOverview') {
                referenceurl = '../views/analyticsOverview.ejs';
                conditionalclasses = "overview-style";
        }
        if (pagename == 'assetsOverview') {
                referenceurl = '../views/assetsOverview.ejs';
                conditionalclasses = "overview-style";
        } 
        if (pagename == 'toolsOverview') {
                referenceurl = '../views/toolsOverview.ejs';
                conditionalclasses = "overview-style";
        } 
        if (pagename == 'gymOverview') {
                referenceurl = '../views/gymOverview.ejs';
                conditionalclasses = "overview-style";
        } 
        if (pagename == 'chatOverview') {
                referenceurl = '../views/chatOverview.ejs';
                conditionalclasses = "overview-style";
        } 
        if (pagename == 'postsOverview') {
                referenceurl = '../views/postsOverview.ejs';
                conditionalclasses = "overview-style";
        } 
       
        
        //SLACK ROUTES//
         
        if (pagename == 'team-board') {
                referenceurl = 'https://noodle.slack.com/messages/general/files/';
                conditionalclasses = "slacksite";
                modal = "no-alert";
        }   
        if (pagename == 'marketing-board') {
                referenceurl = 'https://noodle.slack.com/messages/marketing/files/';
                conditionalclasses =  "slacksite";
                modal = "no-alert";
        }    
        if (pagename == 'product-board') {
                referenceurl = 'https://noodle.slack.com/messages/product/files/';
                conditionalclasses =  "slacksite";
                modal = "no-alert";
        }    
        if (pagename == 'engagement-board') {
                referenceurl = 'https://noodle.slack.com/messages/engagement/files/';
                conditionalclasses =  "slacksite";
                modal = "no-alert";
        }    
        if (pagename == 'dev-board') {
                referenceurl = 'https://noodle.slack.com/messages/deploy/files/';
                conditionalclasses =  "slacksite";
                modal = "no-alert";
        }      
        if (pagename == 'rev-board') {
                referenceurl = 'https://noodle.slack.com/messages/revenue/files/';
                conditionalclasses =  "slacksite";
                modal = "no-alert";
        }    
        if (pagename == 'search-board') {
                referenceurl = 'https://noodle.slack.com/messages/search/files/';
                conditionalclasses =  "slacksite";
                modal = "no-alert";
        }    
        if (pagename == 'search-random') {
                referenceurl = 'https://noodle.slack.com/messages/random/files/';
                conditionalclasses =  "slacksite";
                modal = "no-alert";
        }   
        if (pagename == 'new-post') {
                referenceurl = 'https://noodle.slack.com/files/create/post';
                conditionalclasses =  "slacksite-page";
                modal = "no-alert";
        }     
        if (pagename == 'browse-posts') {
                referenceurl = 'https://noodle.slack.com/files';
                conditionalclasses =  "slacksite-browse";
                modal = "no-alert";
        }     
        

        //LEFTRONIC ROUTES//

         if (pagename == 'executive') {
                 referenceurl = 'https://www.leftronic.com/share/KjsGig/#KjsGig';
                 conditionalclasses =  "leftronics";
                 modal =  "alert-danger-fixed";
         } 
         if (pagename == 'performance') {
                 referenceurl = 'https://www.leftronic.com/share/Ulh0hO';
                 conditionalclasses =  "leftronics";
                  modal = "alert-danger-fixed";
         }
         if (pagename == 'marketing') {
                 referenceurl = 'https://www.leftronic.com/share/GetI9h/#GetI9h' ;
                 conditionalclasses =  "leftronics"; 
                 modal =  "alert-danger-fixed";
         }
         if (pagename == 'engagement') {
                 referenceurl = 'https://www.leftronic.com/share/9ztWYx/#9ztWYx';
                 conditionalclasses =  "leftronics"; 
                 modal =  "alert-danger-fixed";
         }

        res.render('iframe', {
        title: 'Noodle',
        pagename: 'manual',
        referencesite: referenceurl, 
        conditionalclasses: conditionalclasses,
        modal: modal,
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

exports.home = function(req, res){
 
    res.render('home', {
      title: 'Home',
    pagename: 'home',
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

exports.overview = function(req, res){

    res.render('overview', {
    title: 'Analytics Overview',
    pagename: 'overview',
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

//OVERVIEW PAGE ROUTES//

exports.toolsOverview = function(req, res){

    res.render('toolsOverview', {
    title: 'Tools',
    pagename: 'toolsOverview',
    user: req.user
    });
};
exports.analyticsOverview = function(req, res){

    res.render('analyticsOverview', {
    title: 'Analytics',
    pagename: 'analyticsOverview',
    user: req.user
    });
};
exports.assetsOverview = function(req, res){

    res.render('assetsOverview', {
    title: 'Assets',
    pagename: 'assetsOverview',
    user: req.user
    });
};
exports.postsOverview = function(req, res){

    res.render('postsOverview', {
    title: 'Posts',
    pagename: 'postsOverview',
    user: req.user
    });
};
exports.gymOverview = function(req, res){

    res.render('gymOverview', {
    title: 'Gym',
    pagename: 'gymOverview',
    user: req.user
    });
};
exports.chatOverview = function(req, res){

    res.render('chatOverview', {
    title: 'chat',
    pagename: 'chatOverview',
    user: req.user
    });
};



