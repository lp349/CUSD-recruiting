function validate() {
    //@todo
    return false;
}

$(function() {
    $( document ).tooltip();

});

$(document).ready(function () {

    var formFieldsHelp = [
        {
            className:"form-name"
        },
        {
            className: "form-tagline"
        },
        {
            className:"form-short-description"
        },
        {
            className: "form-long-description"
        },
        {
            className: "form-additional-description"
        },
        {
            className:"form-icon-color"
        },
        {
            className:"form-colored-icon"
        },
        {
            className: "form-uncolored-icon"
        },
        {
            className: "form-photo-one"
        },
        {
            className: "form-photo-one-text"
        },
        {
            className:  "form-photo-two"
        },
        {
            className: "form-photo-two-text"
        },
        {
            className: "form-photo-three"
        },
        {
            className: "form-photo-three-text"
        },
        {
            className: "form-roles"
        }
    ];





    $("#id_published").parent().parent().hide(); ///hide "published" field...
    $(".field-name").append("<div class=\"help-button\" title=\"this is a tooltip\">");

    $(".help-button").tooltip({
        tooltipClass: "tooltip",
        position: { my: "left+15 center", at: "right center" }
    })
        .append(Icons.help)
        ;

    $("input:checkbox").parent()
        .addClass("checkbox")
        .append(Icons.checkbox);


    $("input:checkbox:checked").parent().addClass("selected-checkbox");

    $("li").on("click", "label", function (e) {
        // Toggle the checkbox
        var wrapper = $(this);
        $(this).children("input").prop("checked", !$(this).children("input").prop("checked"));
        if ($(this).children("input").prop("checked")) {
            $(wrapper).addClass("selected-checkbox");
        } else {
            $(wrapper).removeClass("selected-checkbox");
        }
    });

    $("input:visible").prop('required',true);

    if ($(".form-title").html().trim().indexOf("Edit")==0) {
        $("input:file").prop('required',false);
    }

    $("textarea").prop('required',true);

    $("input:text").blur(function() {
        var val = $(this).val().trim();
        if (!val || val.length === 0) {
            $(this).addClass("error-field").parent().children(".message").show();
        }else {
            $(this).removeClass("error-field").parent().children(".message").hide();
        }
    });


    $("textarea").blur(function() {
        var val = $(this).val().trim();
        if (!val || val.length === 0) {
            $(this).addClass("error-field").parent().children(".message").show();
        }else {
            $(this).removeClass("error-field").parent().children(".message").hide();
        }
    });

    $("input:visible:text").parent().append("<div class='message'>This field is required</div>");
    $("textarea").parent().append("<div class='message'>This field is required</div>");
    $(".message").hide();

});