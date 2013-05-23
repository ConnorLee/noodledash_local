'use strict';

var mongoDbService = require( '../services/mongoDbService' ),
    marked = require( 'marked' );

/*
 * GET home page.
 */

exports.manual = function ( req, res ) {
    res.render( 'employee-manual', {
        title    : 'Noodle Employee Manual',
        pagename : 'manual',
        user     : req.user
    } );
};

exports.resources = function ( req, res ) {
    res.render( 'resources', {
        title    : 'Noodle Resources',
        pagename : 'resources',
        user     : req.user
    } );
};

exports.main = function ( req, res ) {

    res.render( 'main', {
        title    : 'Noodle',
        pagename : 'home',
        user     : req.user
    } );
};

exports.index = function ( req, res ) {

    var referenceurl = '';
    var releasename = req.params.release;
    //console.log('releasename = ', releasename);

    if ( releasename === 'backlog' ) {
        referenceurl = 'http://www.trackerstorymaps.com/projects/679513/releases';
    }

    if ( releasename === 'pnp' ) {
        referenceurl = 'http://www.trackerstorymaps.com/projects/187445/releases';
    }

    if ( releasename === 'snt' ) {
        referenceurl = 'http://www.trackerstorymaps.com/projects/187421/releases';
    }

    if ( releasename === 'jedis' ) {
        referenceurl = 'http://www.trackerstorymaps.com/projects/305603/releases';
    }

    res.render( 'iframe', {
        title         : 'Noodle',
        referencesite : referenceurl,
        user          : req.user,
        pagename      : 'iframe'
    } );
};

/*
 * Traditional Wiki url route handlers
 */

exports.wiki = function ( req, res ) {
    var contentType = req.params.content;
    //console.log( 'route handler for wiki/' + contentType + '(...) called' );
    //console.log( 'contentType = ', contentType );
    //console.log( "wiki reg.params = ", req.params );

    mongoDbService.getListOfWikiFilesByContentType( contentType ).
        then( function ( list ) {
//            console.show( 'list = ', list );
            res.render( 'wikimain', {
                title       : 'Noodle Wiki',
                pagename    : contentType,
                user        : req.user,
                list        : list,
                contentType : contentType
            } );
        }, function ( err ) {
            //console.log( err );
            res.send( 500, {error : 'Unable to get list'} );
        }
    );

};

exports.wikinewcontent = function ( req, res ) {
    var contentType = req.params.content;
    //console.log( 'contentType = ', contentType );
    //console.log( req.header( 'Referer' ) );
    res.render( 'wikinewcontent', {
        title         : 'Noodle Wiki',
        pagename      : 'add new news',
        user          : req.user,
        cancelbtnhref : req.header( 'Referer' ),
        contentType   : contentType
    } );
};

exports.insertWikiFile = function ( req, res ) {
    var contentType = req.params.content,
        marked = require( 'marked' ),
        data = {};

    //console.log( 'route handler for wiki/newcontent/' + contentType + '(...) called' );
    //console.log( 'contentType = ', contentType );
    //console.log( "wiki reg.params = ", req.params );
    //console.log( 'title = ', req.body.title );
    //console.log( 'article = ', req.body.article );

    //console.log( req.session );
    data.contentType = contentType;
    data.dateCreated = Date.now();
    data.author = req.session.passport.user.displayName;
    data.title = req.body.title;
    data.mrkdown = req.body.article;
    data.html = marked( req.body.article );
    //console.log( data );

    mongoDbService.insertWikiFile( data ).
        then( function ( list ) {
            res.redirect( 'wiki/' + contentType + '/articles' );
        }, function ( err ) {
            //console.log( err );
            res.send( 500, {error : 'Unable to save article.'} );
        }
    );
};

exports.getWikiFileById = function ( req, res ) {
    var contentType = req.params.content,
        id = req.query.id;

    //console.log( 'getWikiFileById called!' );
    //console.log( 'contentType = ', contentType );
    //console.log( 'req.query', req.query );
    //console.log( 'id = ', id );
    mongoDbService.getWikiFileById( id ).
        then( function ( result ) {
            //console.log( 'result = ', result );
            res.render( 'wikieditcontent', {
                title         : 'Noodle Wiki',
                pagename      : 'edit the news',
                user          : req.user,
                cancelbtnhref : req.header( 'Referer' ),
                contentType   : contentType,
                article       : result
            } );
        }, function ( err ) {
            //console.log( err );
            res.send( 500, {error : 'Unable to save article.'} );
        }
    );
};

exports.updateWikiFile = function ( req, res ) {
    var contentType = req.params.content,
        marked = require( 'marked' ),
        data = {},
        _id = req.query.id;

    //console.log( 'route handler for wiki/newcontent/' + contentType + '(...) called' );
    //console.log( 'contentType = ', contentType );
    //console.log( "wiki reg.params = ", req.params );
    //console.log( 'title = ', req.body.title );
    //console.log( 'article = ', req.body.article );

    //console.log( req.session );
    data.title = req.body.title;
    data.mrkdown = req.body.article;
    data.html = marked( req.body.article );
    data.lastModifiedDate = Date.now();
    //console.log( data );

    // first try to read the article to make sure it is still there
    mongoDbService.getWikiFileById( _id ).then(
        // resolved
        function ( response ) {
            //console.log( 'response from getWikiFileById = ', response );
            // if it is there then update it
            if ( response ) {
                mongoDbService.updateWikiFile( _id, data ).
                    then( function ( list ) {
                        res.redirect( 'wiki/' + contentType + '/articles' );
                    }, function ( err ) {
                        //console.log( err );
                        res.send( 500, {error : 'Unable to update article.'} );
                    }
                );
            } else {
                //console.log( 'Article with _id of ', _id, ' doesn\'t exist and can\'t be updated' );
                res.send( 500, {error : 'Unable to update article.'} );
            }
        },
        // rejected
        function () {
            //console.log( "Error reading article with _id of ", _id, " before updating it." );
            res.send( 500, {error : 'Unable to update article.'} );
        }
    );
};

/*
 * Ajax API route handlers
 */

exports.deleteWikiFile = function ( req, res ) {
    // place holder routine until actually coded
    var _id = req.params.articleid;

    //console.log( 'route handler for deleteWikiFile(...) called' );
    //console.log( 'article id for deletetion = ', _id );

    // first try to read the article to make sure it is still there
    mongoDbService.getWikiFileById( _id ).then(
        // resolved
        function ( response ) {
            //console.log( 'response from getWikiFileById = ', response );
            // if it is there then delete it
            if ( response ) {
                mongoDbService.deleteWikiFile( _id ).then(
                    // resolved
                    function () {
                        //console.log( 'Article with id of ', _id, ' has been deleted from the database.' );
                        res.json( {response : 'deleted'} )
                    },
                    // rejected - http response code = 500 + error reported by db service routine
                    function ( err ) {
                        //console.log( "Error deleting article: " + err );
                    }
                );
            } else {
                //console.log( 'Article with id of ', _id, ' doesn\'t exist and can\'t be deleted' );
                res.json( {response : 'already deleted'} )
            }
        },
        // rejected
        function () {
            //console.log( "Error reading article with id of ", _id, " before deleting it." );
        }
    );
};

exports.htmlFromMarkdown = function ( req, res ) {
    var markdown = req.body.markdown;
    var html = marked( markdown );
    res.json( {html : html} );
};

exports.checkIfWikiFileExists = function ( req, res ) {
    var _id = req.query.id;

    // first try to read the article to make sure it is still there
    mongoDbService.getWikiFileById( _id ).then(
        // resolved
        function ( response ) {
            //console.log( 'response from wikiFileById = ', response );
            // if it is there then update it
            if ( response ) {
                res.json( {response : 'exists'} )
            } else {
                res.json( {response : 'deleted'} )
            }
        },
        // rejected
        function () {
            //console.log( "Error reading article with _id of ", _id, " before updating it." );
            res.send( 500, {error : 'Errodd'} );
        }
    );
};
