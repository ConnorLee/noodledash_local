/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ga = require('googleanalytics');

var moment = require('moment');

var passport = require('passport');

var Thirty7SignalsStrategy = require('passport-37signals').Strategy;
var THIRTY7SIGNALS_CLIENT_ID = process.env.THIRTY7SIGNALS_CLIENT_ID;
var THIRTY7SIGNALS_CLIENT_SECRET = process.env.THIRTY7SIGNALS_CLIENT_SECRET;
var THIRTY7SIGNALS_CALLBACK_URL = process.env.THIRTY7SIGNALS_CALLBACK_URL;

var HIGHRISE_TOKEN = process.env.HIGHRISE_TOKEN;

var profile='36017589';
var username=process.env.GA_USERNAME;
var password=process.env.GA_PASSWORD;

visitorsLast30Days = 0;
visitorsSparkline = '';
timeOnSiteLast30Days = 0;
timeOnSiteSparkline = '';
pageViewsLast30Days = 0;
pageViewsSparkline = '';

dailyTimeOnSite = '';
dailyVisitors = '';
dailyPageViews = '';
dailyVisitorsReturning = '';
dailyVisitorsNew = '';
dailyVisitorsPaid = '';
dailyRegistrationEvents = '';
dailyK12Visitors = '';
dailyHigherEducationVisitors = '';
dailySupplementalLearningVisitors = '';
dailyLearningMaterialVisitors = '';
dailyRegistrationPercentage = '';
dailyUniqueLoginEvents = '';
dailyCPC = '';
dailyAdCost = '';
dailyAdClicks = '';

//Get the necessary dates for this stuff.  

var yesterday = new Date();
var yesterdayString = '';
yesterday.setDate(yesterday.getDate() - 1);
yesterdayString += yesterday.toJSON().substr(0,10);

var monthAgo = new Date();
var monthAgoString = '';
monthAgo.setDate(yesterday.getDate() - 30);
monthAgoString += monthAgo.toJSON().substr(0,10);

var twoMonthAgo = new Date();
var twoMonthAgoString = '';
twoMonthAgo.setDate(yesterday.getDate() - 60);
twoMonthAgoString += twoMonthAgo.toJSON().substr(0,10);

var threeMonthAgo = new Date();
var threeMonthAgoString = '';
threeMonthAgo.setDate(yesterday.getDate() - 90);
threeMonthAgoString += threeMonthAgo.toJSON().substr(0,10);

var GA = new ga.GA({
  user: username,
  password: password
});


GA.login(function(err, token) {

  var uniqueVisitorsQuery = {
  'ids': 'ga:'+profile,
  'start-date': monthAgoString,
  'end-date': yesterdayString,
  'dimensions':'ga:date',
  'metrics': 'ga:visitors'
  };
  GA.get(uniqueVisitorsQuery, function(err, entries) {
    dailyVisitors = gaGetDailies(entries, 'ga:visitors');
    visitorsLast30Days = gaGetTotals(entries, 'ga:visitors');
  });

  var timeOnSiteQuery = {
  'ids': 'ga:'+profile,
  'start-date': monthAgoString,
  'end-date': yesterdayString,
  'dimensions':'ga:date',
  'metrics': 'ga:avgTimeOnSite'
  };
  GA.get(timeOnSiteQuery, function(err, entries) {
    dailyTimeOnSite = gaGetDailies(entries, 'ga:avgTimeOnSite');
  });

  var pageViewsQuery = {
  'ids': 'ga:'+profile,
  'start-date': monthAgoString,
  'end-date': yesterdayString,
  'dimensions':'ga:date',
  'metrics': 'ga:pageviews'
  };
  GA.get(pageViewsQuery, function(err, entries) {
    dailyPageViews += ''+gaGetDailies(entries, 'ga:pageviews');
  });
    
  var newVisitorsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:newVisits'
  };
  GA.get(newVisitorsQuery, function(err, entries) {
    dailyVisitorsNew += ''+gaGetDailies(entries, 'ga:newVisits');
  });
 
  var visitsPaidQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:visits',
    'filters': 'ga:medium==cpa,ga:medium==cpc,ga:medium==cpm,ga:medium==cpp,ga:medium==cpv,ga:medium==organic,ga:medium==ppc'
  };
  GA.get(visitsPaidQuery, function(err, entries) {
    dailyVisitorsPaid += ''+gaGetDailies(entries, 'ga:visits');
  });

  var registrationsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:uniqueEvents',
    'filters': 'ga:eventCategory==Registration'
  };
  GA.get(registrationsQuery, function(err, entries) {
    dailyRegistrationEvents += ''+gaGetDailies(entries, 'ga:uniqueEvents');
    dailyRegistrationPercentage = gaDivideDailies(dailyRegistrationEvents, dailyVisitorsNew);
  });

  var dailyUniqueLoginEventsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:uniqueEvents',
    'filters': 'ga:eventCategory==Login'
  };
  GA.get(dailyUniqueLoginEventsQuery, function(err, entries) {
    dailyUniqueLoginEvents = gaGetDailies(entries, 'ga:uniqueEvents');
  });

  var k12VisitorsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:visitors',
    'filters': 'ga:pagePath=~k-12'
  };
  GA.get(k12VisitorsQuery, function(err, entries) {
    dailyK12Visitors += ''+gaGetDailies(entries, 'ga:visitors');
  });

  var higherEducationVisitorsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:visitors',
    'filters': 'ga:pagePath=~graduate,ga:pagePath=~law,ga:pagePath=~mba,ga:pagePath=~medical,ga:pagePath=~college'
  };
  GA.get(higherEducationVisitorsQuery, function(err, entries) {
    dailyHigherEducationVisitors += ''+gaGetDailies(entries, 'ga:visitors');
  });

  var supplementalLearningVisitorsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:visitors',
    'filters': 'ga:pagePath=~tutoring,ga:pagePath=~test-prep,ga:pagePath=~study-abroad,ga:pagePath=~guidance-counseling'
  };
  GA.get(supplementalLearningVisitorsQuery, function(err, entries) {
    dailySupplementalLearningVisitors += ''+gaGetDailies(entries, 'ga:visitors');
  });

  var cpcQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:adCost,ga:adClicks'
  };
  GA.get(cpcQuery, function(err, entries) {
    dailyAdCost += ''+gaGetDailies(entries, 'ga:adCost');
    dailyAdClicks += ''+gaGetDailies(entries, 'ga:adClicks');
    dailyCPC = gaDivideDailiesInteger(dailyAdCost, dailyAdClicks);
    console.log(dailyCPC);
  });

  var learningMaterialVisitorsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:visitors',
    'filters': 'ga:pagePath=~learn'
  };
  GA.get(learningMaterialVisitorsQuery, function(err, entries) {
    dailyLearningMaterialVisitors += ''+gaGetDailies(entries, 'ga:visitors');
  });
});


function gaGetDailies(entries,metric) {
  var dailies = '';
  if (typeof entries != 'undefined') {
  for (var i=0;i<entries.length;i++)
    {
      var metricValue = (entries[i].metrics[0][metric]);
      var entryDate = convertGADateToUTC(entries[i].dimensions[0]['ga:date']);
      dailies += '['+entryDate+','+metricValue+'], ';
    }
  }
    var dailiesLength = dailies.length;
    dailies = '['+dailies.slice(0,dailiesLength-2)+']';
    return dailies;
}

function gaGetTotals(entries,metric) {
  var total = 0;
  if (typeof entries != 'undefined') {
  for (var i=0;i<entries.length;i++)
    {
      var count = (entries[i].metrics[0][metric]);
      total += count;
    }
  }
    return total;
}

function gaDivideDailies(dailiesNumerator, dailiesDenominator) {

  numerator = dailiesToArray(dailiesNumerator);
  denominator = dailiesToArray(dailiesDenominator);

  if (numerator.length == denominator.length) {
    result = '';
    for (var i=0;i<numerator.length;i++){
      resultValue = (dailyGetValue(numerator[i])/dailyGetValue(denominator[i]))*100;
      resultDate = dailyGetDate(numerator[i]);
      result += '['+resultDate+', '+resultValue+'], ';

    }
    result = '['+result.slice(0,result.length-2)+']';
    return result;

  } else {
    console.log("Error! Numerator/Denominator mismatch");
  }
}

function gaDivideDailiesInteger(dailiesNumerator, dailiesDenominator) {

  numerator = dailiesToArray(dailiesNumerator);
  denominator = dailiesToArray(dailiesDenominator);

  if (numerator.length == denominator.length) {
    result = '';
    for (var i=0;i<numerator.length;i++){
      resultValue = (dailyGetValue(numerator[i])/dailyGetValue(denominator[i]));
      resultDate = dailyGetDate(numerator[i]);
      result += '['+resultDate+', '+resultValue+'], ';

    }
    result = '['+result.slice(0,result.length-2)+']';
    return result;

  } else {
    console.log("Error! Numerator/Denominator mismatch");
  }
}

function dailyGetValue(daily){
  valuesArray = daily.split(",");
  value = valuesArray[1];
  return value;
}

function dailyGetDate(daily){
  valuesArray = daily.split(",");
  value = valuesArray[0];
  return value;
}

function dailiesToArray(dailies) {
  // remove first two brackets
  dailies = dailies.substr(2,dailies.length);
  // remove last two brackets
  dailies = dailies.substr(0, dailies.length-2);
  return dailies.split("], [");
}

function convertGADateToUTC(gaDate) {
  var year = gaDate.substr(0,4);
  var month = gaDate.substr(4,2);
  var day = gaDate.substr(6,2);
  var utc = Date.parse(year+'-'+month+'-'+day);
  return utc;
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete 37signals profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the Thirty7signalsStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and 37signals
//   profile), and invoke a callback with a user object.
passport.use(new Thirty7SignalsStrategy({
    clientID: THIRTY7SIGNALS_CLIENT_ID,
    clientSecret: THIRTY7SIGNALS_CLIENT_SECRET,
    callbackURL: THIRTY7SIGNALS_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {     
      // To keep the example simple, the user's 37signals profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the 37signals account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var emailsSentRequest = {
  host : 'www.noodle.org', // here only the domain name
  // (no http/https !)
  path : '/services/general_monitoring.php?token=DK2KKGuvUQSsylvZiNLLMLnrng6hQYAWj4gvBUhXk', // the rest of the url with parameters if needed
  method : 'GET' // do GET
};


// do the GET request
var reqGet = http.request(emailsSentRequest, function(res) {
  console.log("statusCode: ", res.statusCode);
  // uncomment it for header details
//  console.log("headers: ", res.headers);


  res.on('data', function(d) {
  //  var siteStatusJSON = JSON.parse(d+'');
  //  if (siteStatusJSON.emails.emailsJobStatus == 'EmailsAreBeingSent') {
  //    emailJobsWorking = true;
  //  }
  //  else {
  //    emailJobsWorking = false;
  //  }
  });

});

reqGet.end();
reqGet.on('error', function(e) {
  console.error(e);
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.main);
app.get('/manual', routes.manual);
app.get('/resources', routes.resources);
app.get('/releases/:release?', routes.index);


app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { 
    title: 'Account Information',
    pagename: 'account',
    user: req.user 
  });
});

// GET /auth/37signals
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in 37signals authentication will involve
//   redirecting the user to 37signals.com.  After authorization, 37signals
//   will redirect the user back to this application at /auth/37signals/callback
app.get('/auth/37signals',
  passport.authenticate('37signals'),
  function(req, res){
    // The request will be redirected to 37signals for authentication, so this
    // function will not be called.
  });

// GET /auth/37signals/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/37signals/callback', 
  passport.authenticate('37signals', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

