'use strict';
if ( $( '#wiki' ).length ) {

    $( function () {
        var $wikiArticleEditBtn = $( '.wiki-article-edit-btn' ),
            $wikiArticleDeleteBtn = $( '.wiki-article-delete-btn' );

        $wikiArticleEditBtn.on( 'click', function ( event ) {

            var $article = $( this ).parents( '.article' );
            //alert( $article.attr( 'data-id' ) );
        } );

        $wikiArticleDeleteBtn.off('click').on( 'click', function ( event ) {
            var $article = $( this ).parents( '.article' );
            var articleId = $( this ).parents( '.article' ).attr( 'data-id' );
            var promise;
            var $modalArticleDeleted = $( '#modalDeletedArticle' );
            var $modalArticleDoesNotExist = $( '#modalArticleDoesNotExist' );
            //var response = confirm( "Deletetion are permanent and cannot be undone. " +
            //    "Are you sure you want to delete this article?" );

            console.log('request to delete article ', articleId);

            $( '#modalConfirmDelete' ).modal();

            // testing deletion of a non existant article
            //articleId = '5197be49c5cd1c470d000005';

            $( '#wiki-confirm-delete-article-btn' ).off('click').on( 'click', function ( event ) {
                ///wiki/api/v1/article/:articleid - end point url for ajax call
                promise = $.ajax( {
                    url  : '/wiki/api/v1/article/' + articleId,
                    type : 'DELETE'
                } );
                promise.then(
                    // resolved
                    function ( json ) {
                        console.log( 'json = ', json );
                        if ( json.response === 'deleted' ) {
                            //alert( 'The article has been deleted.' );
                            $modalArticleDeleted.modal();
                            $modalArticleDeleted.on( 'hidden', function () {
                                $article.hide( 'slow', function () {
                                    $article.remove();
                                } );
                            } );
                        } else {
                            // already deleted and doesn't exist in the db so remove it from the dom
                            //alert( "This article no longer exists!" );
                            $modalArticleDoesNotExist.modal();
                            $modalArticleDoesNotExist.on( 'hidden', function () {
                                $article.hide( 'slow', function () {
                                    $article.remove();
                                } );
                            } );
                        }
                    },
                    // rejected
                    function () {
                        alert( "There was a problem on the server and it was unable to delete this article!" )
                    }
                );
            } );
        } );
    } );
}
