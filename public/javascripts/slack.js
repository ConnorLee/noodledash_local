// TODO Move this into app.js or some other node file so
// we are not making requests with our token and user id from the client?

var slack_api = '//slack.com/api/files.list'
var slack_api_example = 'files-list-example.json'

//     $(function() {
//     $.getJSON("//slack.com/api/files.list&callback=?",
//       function(response) {
//             // Insert the JSON feed into the #twitterfeed
//             // div as a string
//             $('#placeholder').html(JSON.stringify(response));
//     });
// });

$.getJSON("//slack.com/api/files.list?token=xoxp-2167735219-2168836023-2193290123-7550d4&types=posts&count=1&pretty=1",
    function  (response) {
        // Insert the JSON feed into the #slackfeed
        // div as a string
        var parsed = $('#slackfeed').html(JSON.stringify(response));
        // $.each(response.files, function (i,title) {
        //     $("#title").append("<li>"+title+"</li>");
        //   });
    });


});

// referencing slack_api, which is defined as a URL. Need to parse URL to .html file and reference that html file as opposed to URL? JSON parsing correctly.
// next steps are to parse objects into HTML and style elements in that HTML page to display list of posts (loop through array with for loop and display elements)
