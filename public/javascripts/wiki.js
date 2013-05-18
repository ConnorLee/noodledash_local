'use strict';
if ( $( '#wiki' ).length ) {

    $( function () {
        var $wikiArticleEditBtn = $( '.wiki-article-edit-btn' ),
            $wikiArticleDeleteBtn = $( '.wiki-article-delete-btn' );

        $wikiArticleEditBtn.click( function ( event ) {
            alert( 'here' );
        } );

        $wikiArticleDeleteBtn.click( function ( event ) {
            var response = confirm("Deletetion are permanent and cannot be undone. " +
                "Are you sure you want to delete this article?");

            var $article = $(this).parents('.article');

            alert($article.attr('data-id'));
        } );
    } );
}
