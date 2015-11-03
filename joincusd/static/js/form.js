$(document).ready(function () {

    //$("input:file").addClass("button");
    $("li").on("click", "label", function (e) {
        // Toggle the checkbox
        var wrapper = $(this);
        $(this).children("input").prop("checked", !$(this).children("input").prop("checked"));
        if ($(this).children("input").prop("checked")) {
            $(wrapper).addClass("selected-checkbox") ;
        } else {
            $(wrapper).removeClass("selected-checkbox");
        }
    });
});