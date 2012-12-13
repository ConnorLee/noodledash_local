
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
  var options = {
  'ids': 'ga:'+profile,
  'start-date': monthAgoString,
  'end-date': yesterdayString,
  'dimensions':'ga:date',
  'metrics': 'ga:visitors'
  };
  GA.get(options, function(err, entries) {
    for (var i=0;i<entries.length;i++)
    {
      var dailyVisitors = entries[i].metrics[0]['ga:visitors'];
      visitorsLast30Days += dailyVisitors;
      visitorsSparkline += dailyVisitors+',';
    }
  });
});


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


