$(function() {
   	    var menu_ul = $('.menu > li:not("active") > ul'),
   	           menu_a  = $('.menu > li > a');
   	     menu_ul.hide();
   	    menu_a.click(function(e) {
   	        e.preventDefault();
   	        if(!$(this).hasClass('active')) {
   	            menu_a.removeClass('active');
   	            menu_ul.filter(':visible').slideUp('normal');
   	            $(this).addClass('active').next().stop(true,true).slideDown('normal');
   	        } else {
   	            $(this).removeClass('active');
   	            $(this).next().stop(true,true).slideUp('normal');
   	        }
   	    });
   	});


// $(function() {                       
//   $(".fa.sub").click(function() {  
//     $(this).addClass("active");   
//   });

// //  if(!$(this).hasClass('active')) {
// //  menu_a.removeClass('active');
// //     } else {
// // //remove previous class that was toggled active
// //  menu_a.removeClass('active');
// //     }
// // });