function validate() {
    //@todo
    return false;
}

$(function() {

    $( document ).tooltip();
});


function toImg(link) {
    return "<img src='" + link + "'/>"
}

function toParagraph(str) {
    return "<p>" + str + "</p>";
}

$(document).ready(function () {
    var pictureRelLink = "/static/images/user_guide_picture/";


    var formFieldsHelp = [
        {
            className:"form-name",
            content: toImg(pictureRelLink + "project_name.jpg")
        },
        {
            className: "form-tagline",
            content: toImg(pictureRelLink + "project_tagline.jpg")
        },
        {
            className:"form-short-description",
            content: toImg(pictureRelLink + "project_short_description.jpg")
        },
        {
            className: "form-long-description",
            content: toImg(pictureRelLink + "project_starting_description.jpg")
        },
        {
            className: "form-additional-description",
            content:  toImg(pictureRelLink + "project_additional_description.jpg")
        },
        {
            className:"form-icon-color",
            content: toImg(pictureRelLink + "project_icon_color.jpg")
        },
        {
            className:"form-colored-icon",
            content: toParagraph("An SVG icon, in color")
        },
        {
            className: "form-uncolored-icon",
            content: toParagraph("An SVG icon, in white")
        },
        {
            className: "form-photo-one",
            content: toParagraph("A photo for this posting")
        },
        {
            className: "form-photo-one-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            className:  "form-photo-two",
            content: toParagraph("A photo for this posting")
        },
        {
            className: "form-photo-two-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            className: "form-photo-three",
            content: toParagraph("A photo for this posting")
        },
        {
            className: "form-photo-three-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            className: "form-roles",
            content: toParagraph("Choose the roles to associate with this posting")
        },

        {
            className: "form-projects",
            content: toParagraph("Choose the projects to associate with this role")
        },
        {
            className: "form-role-types",
            content: toParagraph("Choose the role types to associate with this role")
        },
        {
            className: "form-role-name",
            content: toImg(pictureRelLink + "role_title.jpg")
        }
        ,
        {
            className: "form-role-description",
            content: toImg(pictureRelLink + "role_description.jpg")
        }

    ];


    $("#id_published").parent().parent().hide(); ///hide "published" field...
    $(".field-name").append("<div class=\"help-button\">");

    $.each(formFieldsHelp, function(index, field) {
        $("." + field.className + " .field-name .help-button")
            .prop("title", field.className)
            .tooltip({
                tooltipClass: "tooltip",
                content: field.content,
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