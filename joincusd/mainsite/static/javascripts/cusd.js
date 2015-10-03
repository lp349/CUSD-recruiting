//= require jquery/dist/jquery.min.js
//= require foundation/js/foundation/foundation.js
//= require foundation/js/foundation/foundation.equalizer.js
//= require foundation/js/foundation/foundation.reveal.js

$(document).foundation({
  reveal:{
    dismiss_modal_class: 'video-modal__close-button',
    animation: 'fade'
  },
  equalizer: {equalize_on_stack: true}
});

$(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
  var videoContainer = $(this).children('.video-modal__video')[0];

  videoContainer.innerHTML = '<iframe src="//player.vimeo.com/video/'
  + videoContainer.attributes['data-video-id'].nodeValue
  + '?autoplay=1" frameborder="0" height=' 
  + videoContainer.offsetHeight 
  + '" width="'
  + videoContainer.offsetWidth
  + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
});

$(document).on('close.fndtn.reveal', '[data-reveal]', function () {
  $(this).children('.video-modal__video')[0].innerHTML = '';
});