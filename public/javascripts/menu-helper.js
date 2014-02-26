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


$(function() {                       //run when the DOM is ready
  $(".fa.sub").click(function() {  //use a class, since your ID gets mangled
    $(this).addClass("active");      //add the class to the clicked element
  });
});