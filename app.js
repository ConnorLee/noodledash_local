
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ga = require('googleanalytics');

var profile='36017589';
var username='info1@noodle.org';
var password='p@rkavenue';

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

var yesterday = new Date();
var yesterdayString = '';
yesterday.setDate(yesterday.getDate() - 1);
yesterdayString += yesterday.toJSON().substr(0,10);

var monthAgo = new Date();
var monthAgoString = '';
monthAgo.setDate(yesterday.getDate() - 30);
monthAgoString += monthAgo.toJSON().substr(0,10);
console.log(monthAgoString);

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

  var returningVisitsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:visits',
    'filters': "ga:visitorType=='Returning Visitor'"
  };
  GA.get(returningVisitsQuery, function(err, entries) {
    dailyVisitorsReturning += ''+gaGetDailies(entries, 'ga:visits');
  });
    
  var newVisitorsQuery = {
    'ids': 'ga:'+profile,
    'start-date': monthAgoString,
    'end-date': yesterdayString,
    'dimensions': 'ga:date',
    'metrics': 'ga:visits',
    'filters': "ga:visitorType=='New Visitor'"
  };
  GA.get(newVisitorsQuery, function(err, entries) {
    dailyVisitorsNew += ''+gaGetDailies(entries, 'ga:visits');
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
    'dimensions': 'ga:date,ga:eventCategory',
    'metrics': 'ga:uniqueEvents',
    'filters': 'ga:eventCategory==Registration'
  };
  GA.get(registrationsQuery, function(err, entries) {
    dailyRegistrationEvents += ''+gaGetDailies(entries, 'ga:uniqueEvents');
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
  
});

function gaGetDailies(entries,metric) {
  var dailies = '';
  for (var i=0;i<entries.length;i++)
    {
      var metricValue = (entries[i].metrics[0][metric]);
      var entryDate = convertGADateToUTC(entries[i].dimensions[0]['ga:date']);
      dailies += '['+entryDate+','+metricValue+'], ';
    }
    var dailiesLength = dailies.length;
    dailies = '['+dailies.slice(0,dailiesLength-2)+']';
    return dailies; 
}

function gaGetTotals(entries,metric) {
  var total = 0;
  for (var i=0;i<entries.length;i++)
    {
      var count = (entries[i].metrics[0][metric]);
      total += count;
    }
    return total;
}  

function convertGADateToUTC(gaDate) {
  var year = gaDate.substr(0,4);
  var month = gaDate.substr(4,2);
  var day = gaDate.substr(6,2);
  var utc = Date.parse(year+'-'+month+'-'+day); 
  return utc;
}


var optionsget = {
  host : 'www.noodle.org', // here only the domain name
  // (no http/https !)
  path : '/services/general_monitoring.php?token=DK2KKGuvUQSsylvZiNLLMLnrng6hQYAWj4gvBUhXk', // the rest of the url with parameters if needed
  method : 'GET' // do GET
};

console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');

// do the GET request
var reqGet = http.request(optionsget, function(res) {
  console.log("statusCode: ", res.statusCode);
  // uncomment it for header details
//  console.log("headers: ", res.headers);


  res.on('data', function(d) {
    var siteStatusJSON = JSON.parse(d+'');
    if (siteStatusJSON.emails.emailsJobStatus == 'EmailsAreBeingSent') {
      emailJobsWorking = true;
    }
    else {
      emailJobsWorking = false;
    }
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
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());''
});

app.get('/', routes.main);
app.get('/releases/:release?', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


