
(function($) {

    "use strict";
    
    const cfg = {
                scrollDuration : 800, // smoothscroll duration
                mailChimpURL   : ''   // mailchimp url
                };
    const $WIN = $(window);


    // Add the User Agent to the <html>
    // will be used for IE10/IE11 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; rv:11.0))
    const doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);



   /* preloader
    * -------------------------------------------------- */

   /* pretty print
    * -------------------------------------------------- */
    const ssPrettyPrint = function() {
        $('pre').addClass('prettyprint');
        $( document ).ready(function() {
            prettyPrint();
        });
    };

   /* typewriter heading
    * -------------------------------------------------- */
   // ES6 Class
class TypeWriter {
    constructor(txtElement, words, wait = 1000) {
      this.txtElement = txtElement;
      this.words = words;
      this.txt = '';
      this.wordIndex = 0;
      this.wait = parseInt(wait, 10);
      this.type();
      this.isDeleting = false;
    }
  
    type() {
      // Current index of word
      const current = this.wordIndex % this.words.length;
      // Get full text of current word
      const fullTxt = this.words[current];
  
      // Check if deleting
      if(this.isDeleting) {
        // Remove char
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        // Add char
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }
  
      // Insert txt into element
      this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
  
      // Initial Type Speed
      let typeSpeed = 150;
  
      if(this.isDeleting) {
        typeSpeed /= 2;
      }
  
      // If word is complete
      if(!this.isDeleting && this.txt === fullTxt) {
        // Make pause at end
        typeSpeed = this.wait;
        // Set delete to true
        this.isDeleting = true;
      } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        // Move to next word
        this.wordIndex++;
        // Pause before start typing
        typeSpeed = 500;
      }
  
      setTimeout(() => this.type(), typeSpeed);
    }
  }
  
  
  // Init On DOM Load
  document.addEventListener('DOMContentLoaded', init);
  
  // Init App
  function init() {
    const txtElement = document.querySelector('.txt-type');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
  }
    /* visit counter
    * -------------------------------------------------- */
   const countEl = document.getElementById('count');
   
   function updateVisitCount() {
       fetch('https://api.countapi.xyz/update/nikith-kalu/nkvisit/?amount=1')
            .then(res => res.json())
            .then(res => {
                countEl.innerHTML = res.value;
            });
   }
   /* move header
    * -------------------------------------------------- */
    const ssMoveHeader = function () {

        const $hero = $('.s-hero'),
              $hdr = $('.s-header'),
              triggerHeight = $hero.outerHeight() - 170;


        $WIN.on('scroll', function () {

            let loc = $WIN.scrollTop();

            if (loc > triggerHeight) {
                $hdr.addClass('sticky');
            } else {
                $hdr.removeClass('sticky');
            }

            if (loc > triggerHeight + 20) {
                $hdr.addClass('offset');
            } else {
                $hdr.removeClass('offset');
            }

            if (loc > triggerHeight + 150) {
                $hdr.addClass('scrolling');
            } else {
                $hdr.removeClass('scrolling');
            }

        });

    };



   /* mobile menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const $toggleButton = $('.header-menu-toggle');
        const $headerContent = $('.header-content');
        const $siteBody = $("body");

        $toggleButton.on('click', function(event){
            event.preventDefault();
            $toggleButton.toggleClass('is-clicked');
            $siteBody.toggleClass('menu-is-open');
        });

        $headerContent.find('.header-nav a, .btn').on("click", function() {

            // at 900px and below
            if (window.matchMedia('(max-width: 900px)').matches) {
                $toggleButton.toggleClass('is-clicked');
                $siteBody.toggleClass('menu-is-open');
            }
        });

        $WIN.on('resize', function() {

            // above 900px
            if (window.matchMedia('(min-width: 901px)').matches) {
                if ($siteBody.hasClass("menu-is-open")) $siteBody.removeClass("menu-is-open");
                if ($toggleButton.hasClass("is-clicked")) $toggleButton.removeClass("is-clicked");
            }
        });

    };


   /* accordion
    * ------------------------------------------------------ */
    const ssAccordion = function() {

        const $allItems = $('.services-list__item');
        const $allPanels = $allItems.children('.services-list__item-body');

        $allPanels.slice(1).hide();

        $allItems.on('click', '.services-list__item-header', function() {

            const $this = $(this),
                  $curItem = $this.parent(),
                  $curPanel =  $this.next();

            if(!$curItem.hasClass('is-active')){
                $allPanels.slideUp();
                $curPanel.slideDown();
                $allItems.removeClass('is-active');
                $curItem.addClass('is-active');
            }
            
            return false;
        });
    };



   /* photoswipe
    * ----------------------------------------------------- */
    const ssPhotoswipe = function() {
        const items = [],
            $pswp = $('.pswp')[0],
            $folioItems = $('.folio-item');

        // get items
        $folioItems.each( function(i) {

            let $folio = $(this),
                $thumbLink =  $folio.find('.folio-item__thumb-link'),
                $title = $folio.find('.folio-item__title'),
                $caption = $folio.find('.folio-item__caption'),
                $titleText = '<h4>' + $.trim($title.html()) + '</h4>',
                $captionText = $.trim($caption.html()),
                $href = $thumbLink.attr('href'),
                $size = $thumbLink.data('size').split('x'),
                $width  = $size[0],
                $height = $size[1];
        
            let item = {
                src  : $href,
                w    : $width,
                h    : $height
            }

            if ($caption.length > 0) {
                item.title = $.trim($titleText + $captionText);
            }

            items.push(item);
        });

        // bind click event
        $folioItems.each(function(i) {

            $(this).find('.folio-item__thumb-link').on('click', function(e) {
                e.preventDefault();
                let options = {
                    index: i,
                    showHideOpacity: true
                }

                // initialize PhotoSwipe
                let lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
                lightBox.init();
            });

        });
    };



   /* slick slider
    * ------------------------------------------------------ */
    const ssSlickSlider = function() {
            
        $('.testimonial-slider').slick({
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            responsive: [
                {
                    breakpoint: 1080,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    };


   /* Animate On Scroll
    * ------------------------------------------------------ */
    const ssAOS = function() {
        
        AOS.init( {
            offset: 100,
            duration: 600,
            easing: 'ease-in-out',
            delay: 300,
            once: true,
            disable: 'mobile'
        });

    };



   /* alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 

    };

    
   /* smooth scrolling
    * ------------------------------------------------------ */
    const ssSmoothScroll = function() {
        
        $('.smoothscroll').on('click', function (e) {
            const target = this.hash;
            const $target = $(target);
            
            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function () {
                window.location.hash = target;
            });
        });

    };


   /* back to top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {
        
        const pxShow = 800;
        const $goTopButton = $(".ss-go-top")

        // Show or hide the button
        if ($(window).scrollTop() >= pxShow) $goTopButton.addClass('link-is-visible');

        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                if(!$goTopButton.hasClass('link-is-visible')) $goTopButton.addClass('link-is-visible')
            } else {
                $goTopButton.removeClass('link-is-visible')
            }
        });
    };



   /* initialize
    * ------------------------------------------------------ */
    (function ssInit() {
        
        ssPrettyPrint();
        ssMoveHeader();
        ssMobileMenu();
        ssAccordion();
        ssPhotoswipe();
        ssSlickSlider();
        ssAOS();
        ssAlertBoxes();
        ssSmoothScroll();
        ssBackToTop();

    })();

})(jQuery);