

$(window).resize( function() {
    if (window.outerWidth < 920) {
        $(".site-logo__text").hide();
    } else $(".site-logo__text").show();
});

$(window).load(function() {
    if (window.outerWidth < 920) {
        $(".site-logo__text").hide();
    } else $(".site-logo__text").show();
});