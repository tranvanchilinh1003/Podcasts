(function ($) {
    "use strict";
  
    $(document).ready(function() {
      // MENU
      $('.navbar-collapse a').on('click', function() {
        $(".navbar-collapse").collapse('hide');
      });
  
      // CUSTOM LINK
      $('.smoothscroll').click(function() {
        var el = $(this).attr('href');
        var elWrapped = $(el);
        var header_height = $('.navbar').height();
  
        scrollToDiv(elWrapped, header_height);
        return false;
  
        function scrollToDiv(element, navheight) {
          var offset = element.offset();
          var offsetTop = offset.top;
          var totalScroll = offsetTop - 0;
  
          $('body,html').animate({
            scrollTop: totalScroll
          }, 300);
        }
      });
  
      // Initialize Owl Carousel
      if ($.fn.owlCarousel) {
        $('.owl-carousel').owlCarousel({
          center: true,
          loop: true,
          margin: 30,
          autoplay: true,
          responsiveClass: true,
          responsive: {
            0: {
              items: 2,
            },
            767: {
              items: 3,
            },
            1200: {
              items: 4,
            }
          }
        });
      } else {
        console.error('Owl Carousel is not loaded');
      }
    });
  
  })(window.jQuery);
  