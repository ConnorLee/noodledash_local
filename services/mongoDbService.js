/*
 * MondoDb CRUD operations
 */
'use strict';

module.exports = {
    /*
     * Find all article by content type and return them.
     * (ie. finance, news, metrics, handbook, marketing, resources, tools, etc.).
     */
    getListOfWikiFilesByContentType : function ( contentType ) {
        var mongoDb = require( '../app' ).mongoDb,
            wiki = mongoDb.collection( 'wiki' ),
            Q = require( 'q' ),
            deferred = Q.defer();

        //console.log( 'contentType = ', contentType );

        wiki.find( {contentType : contentType} ).sort({dateCreated: -1}).toArray( function ( err, list ) {
            if ( err ) {
                //console.log( 'deferred rejected!' );
                deferred.reject( new Error( 'mongoDbService::getListOfWikiFilesByContentType()' ) );
            } else {
                //console.log( 'deferred resolved!' );
                //console.log( 'list = ', list );
                deferred.resolve( list );
            }
        } );
        // return a promise
        return deferred.promise;
    },
    /*
     * Find and return an article
     */
    getWikiFileById         : function ( _id ) {
        var mongoDb = require( '../app' ).mongoDb,
            wiki = mongoDb.collection( 'wiki' ),
            Q = require( 'q' ),
            deferred = Q.defer();

        wiki.findById( _id, function ( err, file ) {
            if ( err ) {
                deferred.reject( new Error( 'mongoDbService::getWikiFileById()' ) );
            } else {
                deferred.resolve( file );
            }
        } );
        // return a promise
        return deferred.promise;
    },
    /*
     * Insert and return a new article
     */
    insertWikiFile          : function ( file ) {
        var mongoDb = require( '../app' ).mongoDb,
            wiki = mongoDb.collection( 'wiki' ),
            Q = require( 'q' ),
            deferred = Q.defer();

        wiki.insert( file, function ( err, result ) {
            if ( err ) {
                deferred.reject( new Error( 'mongoDbService::insertWikiFile()' ) );
            } else {
                deferred.resolve( result[0] );
            }
        } );
        // return a promise
        return deferred.promise;
    },
    /*
     * Update an article
     */
    updateWikiFile          : function ( id, file ) {
        var mongoDb = require( '../app' ).mongoDb,
            wiki = mongoDb.collection( 'wiki' ),
            Q = require( 'q' ),
            deferred = Q.defer();

        //console.log( '_id = ', id );

        wiki.updateById( id, {$set: {title: file.title, mrkdown: file.mrkdown, html: file.html,
            lastModifiedDate: file.lastModifiedDate}}, function ( err, result ) {
            if ( err ) {
                deferred.reject( new Error( 'mongoDbService::updateWikiFile()' ) );
            } else {
                //console.log( 'result =', result );
                deferred.resolve( result[0] );
            }
        } );
        // return a promise
        return deferred.promise;
    },
    /*
     * Delete an article
     */
    deleteWikiFile          : function ( id ) {
        var mongoDb = require( '../app' ).mongoDb,
            wiki = mongoDb.collection( 'wiki' ),
            Q = require( 'q' ),
            deferred = Q.defer();

        wiki.removeById( id, function ( err ) {
            if ( err ) {
                deferred.reject( new Error( 'mongoDbService::removeWikiFile() ' +
                    'unable to delete article with _id = ' + id ) );
            } else {
                deferred.resolve();
            }
        } );
        return deferred.promise;
    }
};
