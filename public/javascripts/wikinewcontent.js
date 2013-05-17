'use strict';
$( function () {
    var $form = $( '#wikinewcontentform' ),
        $title = $( '#title' ),
        $article = $( '#article' ),
        $savebtn = $( '#savebtn' ),
        //$cancelbtn = $( '#cancelbtn' ),
        $inputs = $( ':input' ).not( ':button,:hidden' );

    // disable the save button until all fields have been entered
    $savebtn.attr( 'disabled', 'disabled' );

    // set the focus on the title input field
    $title.focus();

    // Toggle the disabled state of the save button. Only when both
    // title and article have value will the save button be enabled.
    $inputs.keyup( function ( event ) {
        if ( $title.val().trim() && $article.val().trim() ) {
            $savebtn.removeAttr( 'disabled' );
        } else {
            $savebtn.attr( 'disabled', 'disabled' );
        }
    } );

    $savebtn.click(function(event){
        $form.submit();
    });
} );
