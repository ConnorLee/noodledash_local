
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
        if (pagename == 'analytics-overview') {
                referenceurl = '../views/analytics-overview.ejs';
        } 
        if (pagename == 'assets-overview') {
                referenceurl = '../views/assets-overview.ejs';
        } 
        if (pagename == 'tools-overview') {
                referenceurl = '../views/tools-overview.ejs';
        } 
        if (pagename == 'gym-overview') {
                referenceurl = '../views/gym-overview.ejs';
        } 
        if (pagename == 'chat-overview') {
                referenceurl = '../views/chat-overview.ejs';
        } 
        if (pagename == 'posts-overview') {
                referenceurl = '../views/posts-overview.ejs';
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

exports.overview = function(req, res){

    res.render('tools-overview', {
    title: 'Tools',
    pagename: 'tools-overview',
    user: req.user
    });
};
exports.overview = function(req, res){

    res.render('analytics-overview', {
    title: 'Analytics',
    pagename: 'analytics-overview',
    user: req.user
    });
};
exports.overview = function(req, res){

    res.render('assets-overview', {
    title: 'Assets',
    pagename: 'assets-overview',
    user: req.user
    });
};
exports.overview = function(req, res){

    res.render('posts-overview', {
    title: 'Posts',
    pagename: 'posts-overview',
    user: req.user
    });
};
exports.overview = function(req, res){

    res.render('gym-overview', {
    title: 'Gym',
    pagename: 'gym-overview',
    user: req.user
    });
};
exports.overview = function(req, res){

    res.render('chat-overview', {
    title: 'chat',
    pagename: 'chat-overview',
    user: req.user
    });
};



