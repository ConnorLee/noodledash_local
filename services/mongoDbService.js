/*
 * MondoDb CRUD operations
 */
'use strict';

var mongoDb = require( '../app' ).mongoDb,
    wiki = mongoDb.collection( 'wiki' ),
    Q = require( 'q' );

module.exports = {
    /*
     * Return a short list (_id, name, date created) of wiki files in the db by 
     * content key (ie. finance, news, metrics, handbook, marketing, resources, tools, etc.). 
     */
    getShortListOfWikiFiles : function(contentKey){
        // get a deferred
        var deferred = Q.defer();
        // query for the short list of wiki files
        wiki.find({contentKey : contentKey}).toArray( function ( err, shortList ) {
            if ( err ) {
                deferred.reject( new Error( 'mongoDbService::getShortListOfWikiFiles()' ) );
            } else {
                deferred.resolve( shortList );
            }
        } );
        // return a promise
        return deferred.promise;
    },
    /*
     * Find and return a file document by its id
     */
    getWikiFileById : function(_id){
        var deferred = Q.defer();
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
     * Insert and return a new file document
     */
    insertWikiFile : function(file){
        var deferred = Q.defer();
        wiki.insert( file, function (err, result) {
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
     * Update and return a file document
     */
    updateWikiFile : function(file){
        var deferred = Q.defer();
        wiki.save(file, function(err, result){
            if ( err ) {
                deferred.reject( new Error( 'mongoDbService::updateWikiFile()' ) );
            } else {
                deferred.resolve( result[0] );
            }
        })
        // return a promise
        return deferred.promise;
    },
    /*
     * Delete a file document
     */
    deleteWikiFile : function(id){
        var deferred = Q.defer();
        wiki.removeById(id, function(err){
            if ( err ) {
                deferred.reject( new Error( 'mongoDbService::removeWikiFile()' ) );
            } else {
                deferred.resolve();
            }
        })
        return deferred.promise;
    }
};