'use strict';
if ( $( '#wikinewcontentform' ).length ) {

    $( function () {
        var $form = $( '#wikinewcontentform' ),
            $title = $( '#title' ),
            $article = $( '#article' ),
            $savebtn = $( '#savebtn' ),
            $inputs = $( ':input' ).not( ':button,:hidden' );

        // Disable the save button.
        $savebtn.attr( 'disabled', 'disabled' );

        // Set the focus on the title input field.
        $title.focus();

        // Toggle the disabled state of the save button. Only when both
        // title and article have values will the save button be enabled.
        $inputs.keyup( function ( event ) {
            if ( $title.val().trim() && $article.val().trim() ) {
                $savebtn.removeAttr( 'disabled' );
            } else {
                $savebtn.attr( 'disabled', 'disabled' );
            }
        } );

        // Submit the form when the user clicks the submit button.
        // Better than dealing with a real submit button.
        $savebtn.click( function ( event ) {
            $form.submit();
        } );
    } );
}
