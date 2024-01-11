var slideWrapper = $(".main-slider"),
  lazyImages = slideWrapper.find('.slide-image'),
  lazyCounter = 0,
  isVideoPlaying = false;

function playPauseVideo(slider, control) {
  var currentSlide = slider.find(".slick-current"),
    slideType = currentSlide.hasClass("video") ? "video" : "image",
    video = currentSlide.find("video").get(0);

  if (slideType === "video") {
    if (video != null) {
      if (control === "play") {
        video.play().then(function() {
          isVideoPlaying = true;
        }).catch(function(error) {
          video.play();
        });
      } else {
        video.pause();
        isVideoPlaying = false;
      }
    }
  }
}

// DOM Ready
$(function () {
  if (slideWrapper.length === 0) {
    console.error("The slideWrapper element is not found.");
    return;
  }

  // Initialize
  slideWrapper.on("init", function (slick) {
    resizePlayer();
  });

  slideWrapper.on("beforeChange", function (event, slick, currentSlide, nextSlide) {
    var slideType = slideWrapper.find(".slick-slide").eq(nextSlide).hasClass("video") ? "video" : "image";

    if (slideType === "video") {
      slideWrapper.slick("slickPause");
      isVideoPlaying = false;
      return false; // Pause the slider
    }
  });

  slideWrapper.on("afterChange", function (event, slick, currentSlide) {
    var slideType = slideWrapper.find(".slick-slide").eq(currentSlide).hasClass("video") ? "video" : "image";

    if (slideType === "video" && !isVideoPlaying) {
      playPauseVideo(slideWrapper, "play");
      isVideoPlaying = true;
    }
  });

  slideWrapper.on("lazyLoaded", function (event, slick, image, imageSource) {
    lazyCounter++;
    if (lazyCounter === lazyImages.length) {
      lazyImages.addClass('show');
    }
  });

  // Start the slider
  slideWrapper.slick({
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 600,
    arrows: false,
    dots: true,
    infinite: true,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)"
  });

  // Play video on the first slide
  playPauseVideo(slideWrapper, "play");
});

// Resize event
$(window).on("resize", function () {
  resizePlayer();
});

// Resize player
function resizePlayer() {
  var win = $(".main-slider"),
    width = win.width(),
    height = win.height(),
    ratio = 16 / 9,
    playerWidth,
    playerHeight;

  $(".embed-player").each(function () {
    var current = $(this);
    if (width / ratio < height) {
      playerWidth = Math.ceil(height * ratio);
      current.width(playerWidth).height(height).css({
        left: (width - playerWidth) / 2,
        top: 0
      });
    } else {
      playerHeight = Math.ceil(width / ratio);
      current.width(width).height(playerHeight).css({
        left: 0,
        top: (height - playerHeight) / 2
      });
    }
  });
}


document.documentElement.classList.add('js');
const $rootSingle = $('.awards-single');
const $rootNav = $('.awards-nav');

$rootSingle.slick({
    slide: '.awards_item',
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    adaptiveHeight: true,
    infinite: false,
    useTransform: true,
    speed: 500,
    cssEase: 'cubic-bezier(0.77, 0, 0.18, 1)',
});

$rootNav.on('init', function (event, slick) {
    $(this).find('.slick-slide.slick-current').addClass('is-active');
}).slick({
    slide: '.awards_item',
    slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    focusOnSelect: false,
    infinite: false,
    responsive: [
        {
            breakpoint: 1365,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
});

$rootSingle.on('afterChange', function (event, slick, currentSlide) {
    $rootNav.slick('slickGoTo', currentSlide);
    $rootNav.find('.slick-slide.is-active').removeClass('is-active');
    $rootNav.find('.slick-slide[data-slick-index="' + currentSlide + '"]').addClass('is-active');
});

// Handle click on both slides and arrows in rootNav
$rootNav.on('click', '.slick-slide, .slick-prev, .slick-next', function (event) {
    event.preventDefault();

    // If it's a slide click, get the data-slick-index
    var goToSingleSlide = $(this).data('slick-index');

    // If it's an arrow click, determine the new active slide based on the current active slide
    if (typeof goToSingleSlide === 'undefined') {
        var currentActiveSlide = $rootNav.find('.slick-slide.is-active').data('slick-index');
        if ($(this).hasClass('slick-prev')) {
            goToSingleSlide = currentActiveSlide - 1;
        } else if ($(this).hasClass('slick-next')) {
            goToSingleSlide = currentActiveSlide + 1;
        }
    }

    // Update the rootSingle slider
    $rootSingle.slick('slickGoTo', goToSingleSlide);
});

// Handle initialization and updating of is-active class for arrows
$rootNav.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    $rootNav.find('.slick-prev, .slick-next').removeClass('is-active');
    if (nextSlide === 0) {
        $rootNav.find('.slick-prev').addClass('is-active');
    } else if (nextSlide === slick.slideCount - 1) {
        $rootNav.find('.slick-next').addClass('is-active');
    }
});

// Handle touch swipe in rootNav
$rootNav.on('swipe', function (event, slick, direction) {
    var currentActiveSlide = $rootNav.find('.slick-slide.is-active').data('slick-index');
    var goToSingleSlide;

    if (direction === 'left') {
        goToSingleSlide = currentActiveSlide + 1;
    } else if (direction === 'right') {
        goToSingleSlide = currentActiveSlide - 1;
    }

    // Update the rootSingle slider
    $rootSingle.slick('slickGoTo', goToSingleSlide);
});
