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
            className:"form-name",
            content: '<img src="static/images/icons/projects/cap.svg" />'
        },
        {
            className: "form-tagline",
            content: ""
        },
        {
            className:"form-short-description",
            content: ""
        },
        {
            className: "form-long-description",
            content: ""
        },
        {
            className: "form-additional-description",
            content: ""
        },
        {
            className:"form-icon-color",
            content: ""
        },
        {
            className:"form-colored-icon",
            content: ""
        },
        {
            className: "form-uncolored-icon",
            content: ""
        },
        {
            className: "form-photo-one",
            content: ""
        },
        {
            className: "form-photo-one-text",
            content: ""
        },
        {
            className:  "form-photo-two",
            content: ""
        },
        {
            className: "form-photo-two-text",
            content: ""
        },
        {
            className: "form-photo-three",
            content: ""
        },
        {
            className: "form-photo-three-text",
            content: ""
        },
        {
            className: "form-roles",
            content: ""
        },

        {
            className: "form-projects",
            content: ""
        },
        {
            className: "form-role-types",
            content: ""
        },
        {
            className: "form-role-name",
            content: ""
        }
        ,
        {
            className: "form-role-description",
            content: ""
        }

    ];


    $("#id_published").parent().parent().hide(); ///hide "published" field...
    $(".field-name").append("<div class=\"help-button\">");

    $.each(formFieldsHelp, function(index, field) {
        $("." + field.className + " .field-name .help-button")
            .prop("title", field.className)
            .tooltip({
                tooltipClass: "tooltip",
                content: "<img src='" + field.content + "'/>",
                position: { my: "left+15 center", at: "right center", collision: 'none'},
                hide: false
            }).append(Icons.help);
    });


    //$(".help-button").tooltip({
    //    tooltipClass: "tooltip",
    //    content: '<img src="static/images/icons/projects/cap.svg" />',
    //    position: { my: "left+15 center", at: "right center", collision: 'none'},
    //    hide: false
    //}).append(Icons.help);
    //
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