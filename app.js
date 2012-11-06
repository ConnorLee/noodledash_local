
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , pivotal = require('pivotal')
  , ga = require('googleanalytics');

var pivotalUsername = 'kylejaster';
var pivotalPassword = 'pivotaltrackerx2';

pivotal.getToken(pivotalUsername, pivotalPassword, function(err, token){

    if(err){
        console.error("Could not retrieve token");
    }

    pivotal.useToken(token);

});

//console.log(pivotal.getCurrentIteration('187421'));

var ga = require('googleanalytics');

var profile='36017589';
var username='kyle@noodle.org';
var password='noodlex2';

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

app.get('/', routes.index);
app.get('/releases/:release?', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


