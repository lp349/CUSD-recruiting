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



/**
 * SVG Icons
 * @type {{drag: string, expand: string, retract: string, remove: string}}
 */
var Icons = {
    drag: '<svg class="drag-icon" viewBox="0 0 100 100"> ' +
    '<path d="M 50 85 l 20 20 l -40 0 z" transform="rotate(180,50,85)"></path>' +
    '<path d="M 50 15 l 20 20 l -40 0 z"></path>' +
    '<rect width="15" height="45" x="42.5" y="30" fill="#000"></rect>' +
    '</svg>',

    expand: '<svg class="expand-icon" viewBox="0 0 100 100"> ' +
    '<path d="M 50 75 l 50 50 l -100 0 z" transform="rotate(180,50,75)"></path>' +

    '</svg>',

    retract: '<svg class="retract-icon" viewBox="0 0 100 100"> ' +
    '<path d="M 50 25 l 50 50 l -100 0 z"></path>' +
    '</svg>',

    remove:  '<svg class="remove-icon" viewBox="0 0 100 100"> ' +
    '<circle stroke-width="5px" cx="50%" cy="50%" r="48%"></circle>' +
    '<text  x="50%" y="50%" text-anchor="middle" dominant-baseline="central">x</text> ' +
    '</svg>',

    checkbox: '<svg class="checkbox-icon" viewBox="0 0 100 100"> ' +
    '<path d="M 10 55 l 30 25 l 40 -70"></path>' +
    '</svg>',

};
