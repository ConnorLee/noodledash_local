/**
 * Module dependencies.
 */

var express = require( 'express' );
var routes = require( './routes' );
var http = require( 'http' );
var path = require( 'path' );
var ga = require( 'googleanalytics' );

/*
 * wire up markdown support via marked and set reasonable options
 */
var marked = exports.marked = require( 'marked' );
marked.setOptions( {
    gfm        : true,
    tables     : true,
    breaks     : false,
    pedantic   : false,
    sanitize   : true,
    smartLists : true,
    langPrefix : 'language-',
    highlight  : function ( code, lang ) {
        if ( lang === 'js' ) {
            return highlighter.javascript( code );
        }
        return code;
    }
} );

/*
 * connect to redis via redistogo on heroku
 */
var rtg = require( "url" ).parse( process.env.REDISTOGO_URL );
//console.log( "rtg = ", rtg );
var redis = exports.redis = require( "redis" ).createClient( rtg.port, rtg.hostname );
redis.auth( rtg.auth.split( ":" )[1] );

/*
 * For testing purposed only - *** comment this out when done testing ***
 * Add myself to redis giving myself 'All' permission
 */
/*
redis.set( "6705250", "All", function ( err, res ) {
    if ( err ) {
        console.log( "Error returned when setting my ID" );
        throw err;
    }
    console.log( "Response received setting my ID", res );
} );
*/

/*
 * connect to mongo on heroku
 */
var mongohg = require( 'url' ).parse( process.env.MONGOHQ_URL );
//console.log( "mongohg = ", mongohg );
var mongoauth = mongohg.auth.split( ":" )[1];
var mongoskin = require( 'mongoskin' );
var mongoDb = exports.mongoDb = mongoskin.db( mongohg.href + '?auto_reconnect&poolSize=20', {w : 1} );

///*
// * For testing purposed only - *** comment this out when done testing ***
// * Add some crap to the mongo test collection and read it back
// */
//mongoDb.collection( 'test' ).insert( {content : 'this is a test'}, function ( err, result ) {
//    if ( err ) {
//        throw err;
//    }
//    console.log( 'insert into mongo successful!' );
//    mongoDb.collection( 'test' ).find().toArray( function ( err, results ) {
//        if ( err ) {
//            throw err;
//        }
//        console.log( 'find successful! Returned :', results );
//    } );
//} );

//mongoDb.collection( 'wiki' ).insert( {
//    contentType: 'news',
//    dateCreated: Date.now(),
//    author: 'Jeff Schwartz',
//    mrkdown: '# Yea!',
//    html: marked('# Yea!'),
//    title: 'Noodle Wiki Is Coming Soon!'
//}, function ( err, result ) {
//    if(err){
//        throw err;
//    }
//    console.log( 'insert into mongo successful!' );
//} );

var moment = require( 'moment' );

var passport = require( 'passport' );

var Thirty7SignalsStrategy = require( 'passport-37signals' ).Strategy;
var THIRTY7SIGNALS_CLIENT_ID = process.env.THIRTY7SIGNALS_CLIENT_ID;
var THIRTY7SIGNALS_CLIENT_SECRET = process.env.THIRTY7SIGNALS_CLIENT_SECRET;
var THIRTY7SIGNALS_CALLBACK_URL = process.env.THIRTY7SIGNALS_CALLBACK_URL;

var HIGHRISE_TOKEN = process.env.HIGHRISE_TOKEN;

var profile = '36017589';
var username = process.env.GA_USERNAME;
var password = process.env.GA_PASSWORD;

visitorsLast30Days = 0;
visitorsSparkline = '';
timeOnSiteLast30Days = 0;
timeOnSiteSparkline = '';
pageViewsLast30Days = 0;
pageViewsSparkline = '';

dealsPendingData = [];
dealsWonData = [];
dealsLostData = [];
kasesCreated = '';
kasesClosed = '';
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

//Get the necessary dates for this stuff.

var yesterday = new Date();
var yesterdayString = '';
yesterday.setDate( yesterday.getDate() - 1 );
yesterdayString += yesterday.toJSON().substr( 0, 10 );

var monthAgo = new Date();
var monthAgoString = '';
monthAgo.setDate( yesterday.getDate() - 30 );
monthAgoString += monthAgo.toJSON().substr( 0, 10 );

var twoMonthAgo = new Date();
var twoMonthAgoString = '';
twoMonthAgo.setDate( yesterday.getDate() - 60 );
twoMonthAgoString += twoMonthAgo.toJSON().substr( 0, 10 );

var threeMonthAgo = new Date();
var threeMonthAgoString = '';
threeMonthAgo.setDate( yesterday.getDate() - 90 );
threeMonthAgoString += threeMonthAgo.toJSON().substr( 0, 10 );

var GA = new ga.GA( {
    user     : username,
    password : password
} );

GA.login( function ( err, token ) {

    var uniqueVisitorsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:visitors'
    };
    GA.get( uniqueVisitorsQuery, function ( err, entries ) {
        dailyVisitors = gaGetDailies( entries, 'ga:visitors' );
        visitorsLast30Days = gaGetTotals( entries, 'ga:visitors' );
    } );

    var timeOnSiteQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:avgTimeOnSite'
    };
    GA.get( timeOnSiteQuery, function ( err, entries ) {
        dailyTimeOnSite = gaGetDailies( entries, 'ga:avgTimeOnSite' );
    } );

    var pageViewsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:pageviews'
    };
    GA.get( pageViewsQuery, function ( err, entries ) {
        dailyPageViews += '' + gaGetDailies( entries, 'ga:pageviews' );
    } );

    var newVisitorsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:newVisits'
    };
    GA.get( newVisitorsQuery, function ( err, entries ) {
        dailyVisitorsNew += '' + gaGetDailies( entries, 'ga:newVisits' );
    } );

    var visitsPaidQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:visits',
        'filters'    : 'ga:medium==cpa,ga:medium==cpc,ga:medium==cpm,ga:medium==cpp,ga:medium==cpv,ga:medium==organic,ga:medium==ppc'
    };
    GA.get( visitsPaidQuery, function ( err, entries ) {
        dailyVisitorsPaid += '' + gaGetDailies( entries, 'ga:visits' );
    } );

    var registrationsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:uniqueEvents',
        'filters'    : 'ga:eventCategory==Registration'
    };
    GA.get( registrationsQuery, function ( err, entries ) {
        dailyRegistrationEvents += '' + gaGetDailies( entries, 'ga:uniqueEvents' );
        dailyRegistrationPercentage = gaDivideDailies( dailyRegistrationEvents, dailyVisitorsNew );
    } );

    var dailyUniqueLoginEventsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:uniqueEvents',
        'filters'    : 'ga:eventCategory==Login'
    };
    GA.get( dailyUniqueLoginEventsQuery, function ( err, entries ) {
        dailyUniqueLoginEvents = gaGetDailies( entries, 'ga:uniqueEvents' );
    } );

    var k12VisitorsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:visitors',
        'filters'    : 'ga:pagePath=~k-12'
    };
    GA.get( k12VisitorsQuery, function ( err, entries ) {
        dailyK12Visitors += '' + gaGetDailies( entries, 'ga:visitors' );
    } );

    var higherEducationVisitorsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:visitors',
        'filters'    : 'ga:pagePath=~graduate,ga:pagePath=~law,ga:pagePath=~mba,ga:pagePath=~medical,ga:pagePath=~college'
    };
    GA.get( higherEducationVisitorsQuery, function ( err, entries ) {
        dailyHigherEducationVisitors += '' + gaGetDailies( entries, 'ga:visitors' );
    } );

    var supplementalLearningVisitorsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:visitors',
        'filters'    : 'ga:pagePath=~tutoring,ga:pagePath=~test-prep,ga:pagePath=~study-abroad,ga:pagePath=~guidance-counseling'
    };
    GA.get( supplementalLearningVisitorsQuery, function ( err, entries ) {
        dailySupplementalLearningVisitors += '' + gaGetDailies( entries, 'ga:visitors' );
    } );

    var learningMaterialVisitorsQuery = {
        'ids'        : 'ga:' + profile,
        'start-date' : monthAgoString,
        'end-date'   : yesterdayString,
        'dimensions' : 'ga:date',
        'metrics'    : 'ga:visitors',
        'filters'    : 'ga:pagePath=~learn'
    };
    GA.get( learningMaterialVisitorsQuery, function ( err, entries ) {
        dailyLearningMaterialVisitors += '' + gaGetDailies( entries, 'ga:visitors' );
    } );
} );

function gaGetDailies( entries, metric ) {
    var dailies = '';
    if ( typeof entries != 'undefined' ) {
        for ( var i = 0; i < entries.length; i++ ) {
            var metricValue = (entries[i].metrics[0][metric]);
            var entryDate = convertGADateToUTC( entries[i].dimensions[0]['ga:date'] );
            dailies += '[' + entryDate + ',' + metricValue + '], ';
        }
    }
    var dailiesLength = dailies.length;
    dailies = '[' + dailies.slice( 0, dailiesLength - 2 ) + ']';
    return dailies;
}

function gaGetTotals( entries, metric ) {
    var total = 0;
    if ( typeof entries != 'undefined' ) {
        for ( var i = 0; i < entries.length; i++ ) {
            var count = (entries[i].metrics[0][metric]);
            total += count;
        }
    }
    return total;
}

function gaDivideDailies( dailiesNumerator, dailiesDenominator ) {

    numerator = dailiesToArray( dailiesNumerator );
    denominator = dailiesToArray( dailiesDenominator );

    if ( numerator.length == denominator.length ) {
        result = '';
        for ( var i = 0; i < numerator.length; i++ ) {
            resultValue = (dailyGetValue( numerator[i] ) / dailyGetValue( denominator[i] )) * 100;
            resultDate = dailyGetDate( numerator[i] );
            result += '[' + resultDate + ', ' + resultValue + '], ';

        }
        result = '[' + result.slice( 0, result.length - 2 ) + ']';
        return result;

    } else {
        console.log( "Error! Numerator/Denominator mismatch" );
    }
}

function dailyGetValue( daily ) {
    valuesArray = daily.split( "," );
    value = valuesArray[1];
    return value;
}

function dailyGetDate( daily ) {
    valuesArray = daily.split( "," );
    value = valuesArray[0];
    return value;
}

function dailiesToArray( dailies ) {
    // remove first two brackets
    dailies = dailies.substr( 2, dailies.length );
    // remove last two brackets
    dailies = dailies.substr( 0, dailies.length - 2 );
    return dailies.split( "], [" );
}

function convertGADateToUTC( gaDate ) {
    var year = gaDate.substr( 0, 4 );
    var month = gaDate.substr( 4, 2 );
    var day = gaDate.substr( 6, 2 );
    var utc = Date.parse( year + '-' + month + '-' + day );
    return utc;
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete 37signals profile is
//   serialized and deserialized.
passport.serializeUser( function ( user, done ) {
    done( null, user );
} );

passport.deserializeUser( function ( obj, done ) {
    done( null, obj );
} );

// Use the Thirty7signalsStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and 37signals
//   profile), and invoke a callback with a user object.
passport.use( new Thirty7SignalsStrategy( {
        clientID     : THIRTY7SIGNALS_CLIENT_ID,
        clientSecret : THIRTY7SIGNALS_CLIENT_SECRET,
        callbackURL  : THIRTY7SIGNALS_CALLBACK_URL
    },
    function ( accessToken, refreshToken, profile, done ) {
        // asynchronous verification, for effect...
        process.nextTick( function () {
            //console.log( "profile = ", profile );
            redis.get( profile.id.toString(), function ( err, reply ) {
                if ( err ) {
                    console.log( "redis.get returned err", err );
                    throw err;
                }

                // add user's permission setting returned from redis to their passport which is stored in the session
                //console.log( "User permission ", reply, " associated profile ID", profile.id );
                profile.userPermission = reply;

                // To keep the example simple, the user's 37signals profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the 37signals account with a user record in your database,
                // and return that user instead.
                return done( null, profile );
            } );
        } );
    }
) );

// get highrise info
var request = require( 'request' );
var parseString = require( 'xml2js' ).parseString;

highriseOptions = {
    'auth' : {
        'user'            : HIGHRISE_TOKEN,
        'pass'            : 'X',
        'sendImmediately' : false
    }
};

highriseResponse = request.get( 'https://noodleeducation.highrisehq.com/kases.xml', highriseOptions, function ( error, response, body ) {
    if ( response.statusCode == 201 ) {
        console.log( 'returned 201' );
    } else {
        console.log( 'error: ' + response.statusCode );
        var kasesList = [];
        var xml = body;
        parseString( xml, {ignoreAttrs : true}, function ( err, result ) {
            for ( var i = 0; i < result.kases.kase.length; ++i ) {
                kasesData = result.kases.kase[i]['created-at'];
                kasesList.push( kasesData );
            }
        } );
        kasesCreated += '[[1,' + kasesInDateRange( yesterday, monthAgo, kasesList ) + '],';
        kasesCreated += '[2,' + kasesInDateRange( monthAgo, twoMonthAgo, kasesList ) + '],';
        kasesCreated += '[3,' + kasesInDateRange( twoMonthAgo, threeMonthAgo, kasesList ) + ']]';
    }
} );

highriseResponse = request.get( 'https://noodleeducation.highrisehq.com/kases/closed.xml', highriseOptions,
    function ( error, response, body ) {
        if ( response.statusCode == 201 ) {
            console.log( 'returned 201' );
        } else {
            console.log( 'error: ' + response.statusCode );
            var kasesList = [];
            var xml = body;
            parseString( xml, {ignoreAttrs : true}, function ( err, result ) {
                for ( var i = 0; i < result.kases.kase.length; ++i ) {
                    kasesData = result.kases.kase[i]['closed-at'];
                    kasesList.push( kasesData );
                }
            } );
            kasesClosed += '[[1,' + kasesInDateRange( yesterday, monthAgo, kasesList ) + '],';
            kasesClosed += '[2,' + kasesInDateRange( monthAgo, twoMonthAgo, kasesList ) + '],';
            kasesClosed += '[3,' + kasesInDateRange( twoMonthAgo, threeMonthAgo, kasesList ) + ']]';
        }
    } );

// get highrise deals
highriseResponse = request.get( 'https://noodleeducation.highrisehq.com/deals.xml', highriseOptions,
    function ( error, response, body ) {
        if ( response.statusCode == 201 ) {
            console.log( 'returned 201' );
        } else {
            console.log( 'error: ' + response.statusCode );
            var dealsWon = 0;
            var dealsPending = 0;
            var dealsLost = 0;
            var xml = body;
            parseString( xml, {ignoreAttrs : true}, function ( err, result ) {
                for ( var i = 0; i < result.deals.deal.length; ++i ) {
                    var dealStatus = result.deals.deal[i].status[0];
                    var dealDate = result.deals.deal[i]['updated-at'];
                    var cleanStartDate = moment( yesterday + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
                    var cleanEndDate = moment( monthAgo + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
                    var cleanDateDeal = moment( dealDate + '', "YYYY-MM-DDTHH:mm:ssZ" ).toDate();
                    if ( moment( cleanDateDeal ).isBefore( cleanStartDate ) && moment( cleanDateDeal ).isAfter( cleanEndDate ) ) {
                        switch ( dealStatus ) {
                            case "won":
                                dealsWon++;
                                break;
                            case "pending":
                                dealsPending++;
                                break;
                            case "lost":
                                dealsLost++;
                                break;
                            default:
                                console.log( dealStatus );
                        }
                    }
                }
//           dealsPendingData += '[[1,'+dealsPending+']';
//           dealsLostData += '[[1,'+dealsLost+']';
//           dealsWonData += '[[1,'+dealsWon+']';
//          Or do with .push into an array?
                dealsPendingData.splice( 0, 0, '[[1,' + dealsPending + ']' );
                dealsLostData.splice( 0, 0, '[[1,' + dealsLost + ']' );
                dealsWonData.splice( 0, 0, '[[1,' + dealsWon + ']' );
            } );
        }
    } );

highriseResponse = request.get( 'https://noodleeducation.highrisehq.com/deals.xml', highriseOptions,
    function ( error, response, body ) {
        if ( response.statusCode == 201 ) {
            console.log( 'returned 201' );
        } else {
            console.log( 'error: ' + response.statusCode );
            var dealsWon = 0;
            var dealsPending = 0;
            var dealsLost = 0;
            var xml = body;
            parseString( xml, {ignoreAttrs : true}, function ( err, result ) {
                for ( var i = 0; i < result.deals.deal.length; ++i ) {
                    var dealStatus = result.deals.deal[i].status[0];
                    var dealDate = result.deals.deal[i]['updated-at'];
                    var cleanStartDate = moment( monthAgo + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
                    var cleanEndDate = moment( twoMonthAgo + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
                    var cleanDateDeal = moment( dealDate + '', "YYYY-MM-DDTHH:mm:ssZ" ).toDate();
                    if ( moment( cleanDateDeal ).isBefore( cleanStartDate ) && moment( cleanDateDeal ).isAfter( cleanEndDate ) ) {
                        switch ( dealStatus ) {
                            case "won":
                                dealsWon++;
                                break;
                            case "pending":
                                dealsPending++;
                                break;
                            case "lost":
                                dealsLost++;
                                break;
                            default:
                                console.log( dealStatus );
                        }
                    }
                }
//          dealsPendingData += '[2,'+dealsPending+']';
//          dealsLostData += '[2,'+dealsLost+']';
//          dealsWonData += '[2,'+dealsWon+']';
                dealsPendingData.splice( 1, 0, '[2,' + dealsPending + ']' );
                dealsLostData.splice( 1, 0, '[2,' + dealsLost + ']' );
                dealsWonData.splice( 1, 0, '[2,' + dealsWon + ']' );
            } );
        }
    } );

highriseResponse = request.get( 'https://noodleeducation.highrisehq.com/deals.xml', highriseOptions,
    function ( error, response, body ) {
        if ( response.statusCode == 201 ) {
            console.log( 'returned 201' );
        } else {
            console.log( 'error: ' + response.statusCode );
            var dealsWon = 0;
            var dealsPending = 0;
            var dealsLost = 0;
            var xml = body;
            parseString( xml, {ignoreAttrs : true}, function ( err, result ) {
                for ( var i = 0; i < result.deals.deal.length; ++i ) {
                    var dealStatus = result.deals.deal[i].status[0];
                    var dealDate = result.deals.deal[i]['updated-at'];
                    var cleanStartDate = moment( twoMonthAgo + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
                    var cleanEndDate = moment( threeMonthAgo + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
                    var cleanDateDeal = moment( dealDate + '', "YYYY-MM-DDTHH:mm:ssZ" ).toDate();
                    if ( moment( cleanDateDeal ).isBefore( cleanStartDate ) && moment( cleanDateDeal ).isAfter( cleanEndDate ) ) {
                        switch ( dealStatus ) {
                            case "won":
                                dealsWon++;
                                break;
                            case "pending":
                                dealsPending++;
                                break;
                            case "lost":
                                dealsLost++;
                                break;
                            default:
                                console.log( dealStatus );
                        }
                    }
                }
//           dealsPendingData += '[3,'+dealsPending+']]';
//           dealsLostData += '[3,'+dealsLost+']]';
//           dealsWonData += '[3,'+dealsWon+']]';
                dealsPendingData.splice( 2, 0, '[3,' + dealsPending + ']]' );
                dealsLostData.splice( 2, 0, '[3,' + dealsLost + ']]' );
                dealsWonData.splice( 2, 0, '[3,' + dealsWon + ']]' );
            } );
        }
    } );

function kasesInDateRange( startDate, endDate, caseList ) {
    var counter = 0;
    caseList.forEach( function ( kase ) {
        var cleanStartDate = moment( startDate + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
        var cleanEndDate = moment( endDate + '', "ddd MMM DD YYYY HH:mm:ss Z" ).toDate();
        var cleanDateKase = moment( kase + '', "YYYY-MM-DDTHH:mm:ssZ" ).toDate();
//      console.log(cleanDateKase + " " + kase + " is before " + cleanStartDate + " and after " + cleanEndDate);
        if ( moment( cleanDateKase ).isBefore( cleanStartDate ) && moment( cleanDateKase ).isAfter( cleanEndDate ) ) {
            counter++;
        }
    } );
    return counter;
}

//countDeals(yesterday, monthAgo);
//countDeals(monthAgo, twoMonthAgo);
//countDeals(twoMonthAgo, threeMonthAgo);
//
//function countDeals(startDate,endDate) {
//    var cleanStartDate = moment(startDate+'', "ddd MMM DD YYYY HH:mm:ss Z").toDate();
//    var cleanEndDate = moment(endDate+'', "ddd MMM DD YYYY HH:mm:ss Z").toDate();
//    var cleanDateDeal = moment(dealDate+'', "YYYY-MM-DDTHH:mm:ssZ").toDate();
//    if(moment(cleanDateDeal).isBefore(cleanStartDate) && moment(cleanDateDeal).isAfter(cleanEndDate)) {
//      switch(dealStatus) {
//        case "won":
//          dealsWon++;
//          break;
//        case "pending":
//          dealsPending++;
//          break;
//        case "lost":
//          dealsLost++;
//          break;
//        default:
//          console.log(dealStatus);
//      }
//    }
//}

var emailsSentRequest = {
    host   : 'www.noodle.org', // here only the domain name
    // (no http/https !)
    path   : '/services/general_monitoring.php?token=DK2KKGuvUQSsylvZiNLLMLnrng6hQYAWj4gvBUhXk', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

// do the GET request
var reqGet = http.request( emailsSentRequest, function ( res ) {
    console.log( "statusCode: ", res.statusCode );
    // uncomment it for header details
//  console.log("headers: ", res.headers);

    res.on( 'data', function ( d ) {
        var siteStatusJSON = JSON.parse( d + '' );
        if ( siteStatusJSON.emails.emailsJobStatus == 'EmailsAreBeingSent' ) {
            emailJobsWorking = true;
        }
        else {
            emailJobsWorking = false;
        }
    } );

} );

reqGet.end();
reqGet.on( 'error', function ( e ) {
    console.error( e );
} );

var app = express();

app.configure( function () {
    app.set( 'port', process.env.PORT || 3000 );
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'ejs' );
    app.use( express.favicon() );
    app.use( express.logger( 'dev' ) );
    app.use( express.bodyParser() );
    app.use( express.methodOverride() );
    app.use( express.cookieParser( 'your secret here' ) );
    app.use( express.session( { secret : 'keyboard cat' } ) );
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use( passport.initialize() );
    app.use( passport.session() );
    app.use( app.router );
    app.use( require( 'less-middleware' )( { src : __dirname + '/public' } ) );
    app.use( express.static( path.join( __dirname, 'public' ) ) );
} );

app.configure( 'development', function () {
    app.use( express.errorHandler() );
} );

app.get( '/', routes.main );
app.get( '/manual', validateUserPermission, routes.manual );
app.get( '/resources', validateUserPermission, routes.resources );
app.get( '/releases/:release?', validateUserPermission, routes.index );

/*
 Routing for wiki urls
 */
app.get( '/wiki/:content', validateUserPermission, routes.wiki );
app.get( '/wiki/newcontent/:content', validateUserPermission, routes.wikinewcontent );
app.post( '/wiki/newcontent/:content', validateUserPermission, routes.insertWikiFile );
//app.get( '/wiki/finance', validateUserPermission, routes.wikifinance );
//app.get( '/wiki/news', validateUserPermission, routes.wikinews );
//app.get( '/wiki/metrics', validateUserPermission, routes.wikimetrics );
//app.get( '/wiki/handbook', validateUserPermission, routes.wikihandbook );
//app.get( '/wiki/marketing', validateUserPermission, routes.wikimarketing );
//app.get( '/wiki/resources', validateUserPermission, routes.wikiresources );
//app.get( '/wiki/tools', validateUserPermission, routes.wikitools );

/*
 API Routing for AJAX calls
 */
app.get( '/wiki/api/v1/shortlist/:contentType', routes.getShortListOfWikiFiles );
app.get( '/wiki/api/v1/file/:id', routes.getWikiFileById );
app.post( '/wiki/api/v1/file', routes.insertWikiFile );
app.put( '/wiki/api/v1/file', routes.updateWikiFile );
app.delete( '/wiki/api/v1/article/:articleid', routes.deleteWikiFile );

app.get( '/account', ensureAuthenticated, function ( req, res ) {
    res.render( 'account', {
        title    : 'Account Information',
        pagename : 'account',
        user     : req.user
    } );
} );

// GET /auth/37signals
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in 37signals authentication will involve
//   redirecting the user to 37signals.com.  After authorization, 37signals
//   will redirect the user back to this application at /auth/37signals/callback
app.get( '/auth/37signals',
    passport.authenticate( '37signals' ),
    function ( req, res ) {
        // The request will be redirected to 37signals for authentication, so this
        // function will not be called.
    } );

// GET /auth/37signals/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/auth/37signals/callback',
    passport.authenticate( '37signals', { failureRedirect : '/login' } ),
    function ( req, res ) {
        res.redirect( '/' );
    } );

app.get( '/logout', function ( req, res ) {
    req.logout();
    res.redirect( '/' );
} );

http.createServer( app ).listen( app.get( 'port' ), function () {
    console.log( "Express server listening on port " + app.get( 'port' ) );
} );

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated( req, res, next ) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect( '/login' )
}

// Route middleware used to validate that a user has permission to a url
function validateUserPermission( req, res, next ) {
    var id = req.session.passport.user.id;
    //console.log( "reg.session = ", req.session );
    var permission = req.session.passport.user.userPermission;
    var hasPermission = false;
    var requestPath = req.path;
    /*
     * route permissions
     * keys values are = request.path
     * value = an array of permissions imposed on the user to have access to the request.path
     */
    var pathPermissions = {
        // currently supported in production
        '/releases/snt'     : ['Board', 'Exec', 'All'],
        '/releases/pnp'     : ['Board', 'Exec', 'All'],
        '/releases/jedis'   : ['Board', 'Exec', 'All'],
        '/releases/backlog' : ['Board', 'Exec', 'All'],
        '/manual'           : [/*'Board',*/ 'Exec', 'All'],
        '/resources'        : ['Board', 'Exec', 'All'],
        // wiki suported not in production
        '/wiki/finance'     : ['Board', 'Exec'/*, 'All'*/],
        '/wiki/news'        : ['Board', 'Exec', 'All'],
        '/wiki/metrics'     : ['Board', 'Exec', 'All'],
        '/wiki/handbook'    : [/*'Board',*/ 'Exec', 'All'],
        '/wiki/marketing'   : [/*'Board',*/ 'Exec', 'All'],
        '/wiki/resources'   : [/*'Board',*/ 'Exec', 'All'],
        '/wiki/tools'       : [/*'Board',*/ 'Exec', 'All'],
        '/wiki/newcontent/finance'  : ['Board', 'Exec', 'All'],
        '/wiki/newcontent/news'  : ['Board', 'Exec', 'All'],
        '/wiki/newcontent/metrics'  : ['Board', 'Exec', 'All'],
        '/wiki/newcontent/handbook'  : ['Board', 'Exec', 'All'],
        '/wiki/newcontent/marketing'  : ['Board', 'Exec', 'All'],
        '/wiki/newcontent/resources'  : ['Board', 'Exec', 'All'],
        '/wiki/newcontent/tools'  : ['Board', 'Exec', 'All'],
        '/wiki/newcontent'  : ['Board', 'Exec', 'All']
    };
    var requiredPermissions, i, len;

    /*
     // mock the test here so that I have permission - remove after testing
     permission = 'Board';
     */

    /*
    console.log( "user's id = ", id );
    console.log( "user's permission = ", permission );
    console.log( "requestPath = ", requestPath );
    */

    if ( !permission ) {
        /// users that don't have a permission assigned to them are routed to '/'
        //console.log( "User with 37signals id = ", id, " is not in redis and is being routed to '/'" );
        res.redirect( '/' )
    } else {
        /// users that have a permission assigned to them must have a valid assigned permission to the requested path
        //console.log( "User with 37signals id =  ", id, " and permissions = ", permission, " requested to be routed to '", requestPath, "'" );

        // get the required permissions for the requested path
        requiredPermissions = pathPermissions[requestPath];
        //console.log( "requiredPermissions = ", requiredPermissions );
        for ( i = 0, len = requiredPermissions.length; i < len; i += 1 ) {
            if ( requiredPermissions[i] === permission ) {
                hasPermission = true;
                //console.log( "User with 37signals id has permission to be routed to path '", requestPath, "'" );
                break;
            }
        }

        // the user has permission to the url
        if ( hasPermission ) {
            //console.log( "returning next" );
            return next();
        } else {
            res.redirect( '/' );
        }
    }
}
