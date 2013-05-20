'use strict';
if ( $( '#wikieditcontentform' ).length ) {

    $( function () {
        var $form = $( '#wikieditcontentform' ),
            $title = $( '#title' ),
            $article = $( '#article' ),
            $savebtn = $( '#savebtn' ),
            $inputs = $( ':input' ).not( ':button,:hidden' ),
            $viewcodebtn = $( '#viewcodebtn' ),
            $viewpreviewbtn = $( '#viewpreviewbtn' ),
            $editcontainer = $( '#edit-container' ),
            $previewcontainer = $( '#preview-container' );

        console.log( $editcontainer.length );

        // Disable the save button.
        //$savebtn.attr( 'disabled', 'disabled' );

        // begin with code as active radion button in the code/preview radio group
        $viewcodebtn.addClass( 'active' );
        $previewcontainer.hide();

        // react to code/preview toggle
        $viewcodebtn.click( function () {
            $previewcontainer.hide();
            $editcontainer.show();
        } );

        $viewpreviewbtn.click( function () {
            var markdown = $article.val();
            var promise;

            promise = $.post( "/wiki/api/vi/htmlfrommarkdown", {markdown : markdown}, "json" );
            promise.then(
                function ( json ) {
                    $editcontainer.hide();
                    $previewcontainer.html( json.html );
                    $previewcontainer.show();
                }, function () {
                    alert( 'Whoops! This is embarrassing but something appears to have gone wrong.' );
                }
            );
            $editcontainer.hide();
            $previewcontainer.show();
        } );

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
