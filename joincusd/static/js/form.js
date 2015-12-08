$(function () {
    $(document).tooltip();
});

/**
 * Returns the type of form
 * @returns {string} : can be "Project", "Role Type", "Role"
 * @private
 */
function _getFormType() {
    var formContentDivClass = ".form-content";
    if ($(formContentDivClass).hasClass("project-form-content")) {
        return "Project";
    }
    if ($(formContentDivClass).hasClass("role-type-form-content")) {
        return "Role Type";
    }
    if ($(formContentDivClass).hasClass("role-form-content")) {
        return "Role";
    }

    if ($(formContentDivClass).hasClass("application-form-content")) {
        return "Application";
    }

    return "Error: Cannot determine form type"
}

/**
 * Returns whether it's an editing form or adding form
 * @returns {string} "Add" or "Edit"
 */
function _getFormState() {
    if ($(".form-title").html().trim().indexOf("Edit") == 0) {
        return "Edit";
    }
    return "Add";
}

function toImg(link) {
    return "<img src='" + link + "'/>"
}

function toParagraph(str) {
    return "<p>" + str + "</p>";
}

var addInputRequired  = function(input) {
    $(input).prop('required', true)
        .closest(".field-wrapper")
        .children(".field-name")
        .append("<span class=\"require\">*</span>");
}



var setInputRequired = function (input) {
    $(input).prop('required', true)
        .closest(".field-wrapper")
        .children(".field-name")
        .children("span.require")
        .show();


};

var unSetRequired = function (input) {
    $(input).prop('required', false)
        .closest(".field-wrapper")
        .children(".field-name")
        .children("span.require")
        .hide();
};

function _setPhotosAndIcons() {
    //bind previews, original images (if any), and captions to photos for easier manipulation
    var photo1 = $(".form-photo-one").children("input:file")
        .data("preview", $(".form-photo-one").children(".photo-container").children("img"))
        .data("original-picture", $(".form-photo-one").children(".photo-container").children("img").attr("src"))
        .data("caption", $(".form-photo-one-text").children("input"));
    var photo2 = $(".form-photo-two").children("input:file")
        .data("preview", $(".form-photo-two").children(".photo-container").children("img"))
        .data("original-picture", $(".form-photo-two").children(".photo-container").children("img").attr("src"))
        .data("caption", $(".form-photo-two-text").children("input"));
    var photo3 = $(".form-photo-three").children("input:file")
        .data("preview", $(".form-photo-three").children(".photo-container").children("img"))
        .data("original-picture", $(".form-photo-three").children(".photo-container").children("img").attr("src"))
        .data("caption", $(".form-photo-three-text").children("input"));

    var iconColored = $(".form-colored-icon").children("input:file")
        .data("preview", $(".form-colored-icon").children(".photo-container").children("img"))
        .data("original-picture", $(".form-colored-icon").children(".photo-container").children("img").attr("src"));
    var iconUncolored = $(".form-uncolored-icon").children("input:file")
        .data("preview", $(".form-uncolored-icon").children(".photo-container").children("img"))
        .data("original-picture", $(".form-uncolored-icon").children(".photo-container").children("img").attr("src"));

    var iconFields = [iconColored, iconUncolored];
    var photoFields = [photo1, photo2, photo3];


    //set up previews for uploaded images
    $.map(iconFields.concat(photoFields), function (field, index) {
        field.change(function () {
            if ($(this).val()) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(field).data("preview").attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                $(field).data("preview").attr('src', field.data("original-picture"));
            }
        });
    });

    $.map(photoFields, function (photo, index) {
        //photos not required by default
        unSetRequired(photo);
        var caption = photo.data("caption");
        var preview = photo.data("preview");
        var originalPic = photo.data("original-picture");

        //set up:
        // if no photos are bound to field,
        // captions are neither required nor enabled
        if (!preview.attr("src")) {
            unSetRequired(caption);
            caption.prop("disabled", true);
        }

        //if photos are uploaded,
        //make captions for that photo required
        photo.change(function () {
            if (photo.val()) {
                setInputRequired(caption);
                caption.prop("disabled", false);
            } else if (!originalPic){
                //fresh application, not editing
                unSetRequired(caption);
                caption.prop("disabled", true);
            }
        });
    });
}

/**
 * Set up required fields for admin forms
 * @private
 */
function _setAdminRequiredFields() {

    //generally, all input is required
    addInputRequired("input:visible");
    addInputRequired("textarea");

    //there are exceptions, which we deal with here
    if (_getFormState() == "Edit") {
        //if editing, file uploads are not required
        unSetRequired("input:file");
    }

    if (_getFormType() == "Role") {
        //selecting projects is required for role form
        //but role types isn't required
        $("input:checkbox")
            .closest(".field-wrapper.form-projects")
            .children(".field-name").append("<span class=\"require\">*</span>");
    }

    //set up photos and icons previews
    // and toggle caption requirement for photos
    _setPhotosAndIcons();
}


/**
 * Set up required fields for applicant form
 * @private
 */
function _setApplicationRequiredFields() {
    var setInputRequired = function (input) {
        $(input).prop('required', true)
            .closest(".field-wrapper")
            .children(".field-name").append("<span class=\"require\">*</span>");

    };

    setInputRequired("input:visible");
}


/***
 * Sets tool tips
 * @param fieldsData : Object (array) of objects each with form
 * {
 * className:
 *      [CLASS NAME OF WRAPPER ELEMENT],
 *  content:
 *      [HTML CONTENT TO DISPLAY IN TOOLTIP]
 * }
 */
function _setHelpTips(fieldsData) {
    $(".field-name").append("<div class=\"help-button\">");


    $.each(fieldsData, function (index, field) {
        $("." + field.className + " .field-name .help-button")
            .prop("title", field.className)
            .tooltip({
                tooltipClass: "tooltip",
                content: field.content,
                position: {my: "left+15 center", at: "right center", collision: 'none'},
                hide: false
            }).append(Icons.help);
    });
}

/**
 * Sets up Error Messages display and events for forms
 */
function _setErrorMessages() {
    $("input:text").blur(function () {
        var val = $(this).val().trim();
        if (!val || val.length === 0) {
            $(this).addClass("error-field").parent().children(".message").show();
        } else {
            $(this).removeClass("error-field").parent().children(".message").hide();
        }
    });

    $("textarea").blur(function () {
        var val = $(this).val().trim();
        if (!val || val.length === 0) {
            $(this).addClass("error-field").parent().children(".message").show();
        } else {
            $(this).removeClass("error-field").parent().children(".message").hide();
        }
    });

    $("input:visible:text").parent().append("<div class='message'>This field is required</div>");
    $("textarea").parent().append("<div class='message'>This field is required</div>");
    $(".message").hide();
}

/**
 * Initiates form
 * @param fieldsData : Object (array) of objects each with form
 * {
 * className:
 *      [CLASS NAME OF WRAPPER ELEMENT],
 *  content:
 *      [HTML CONTENT TO DISPLAY IN TOOLTIP]
 * }
 */
function init(fieldsData) {

    //set up checkboxes
    $("input:checkbox")
        .parent()
        .addClass("checkbox")
        .prepend(Icons.checkbox);

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

    if (_getFormType() !== "Application") {
        _setAdminRequiredFields();
    } else {
        _setApplicationRequiredFields();
    }

    _setHelpTips(fieldsData);
    _setErrorMessages();

}

$(document).ready(function () {
    //relative location of images
    var pictureRelLink = "/static/images/user_guide_picture/";

    var projectFieldsHelp = [
        {
            formType: "project",
            className: "form-name",
            content: toImg(pictureRelLink + "project_name.jpg")
        },
        {
            formType: "project",
            className: "form-tagline",
            content: toImg(pictureRelLink + "project_tagline.jpg")
        },
        {
            formType: "project",
            className: "form-short-description",
            content: toImg(pictureRelLink + "project_short_description.jpg")
        },
        {
            formType: "project",
            className: "form-long-description",
            content: toImg(pictureRelLink + "project_starting_description.jpg")
        },
        {
            formType: "project",
            className: "form-additional-description",
            content: toImg(pictureRelLink + "project_additional_description.jpg")
        },
        {
            formType: "project",
            className: "form-icon-color",
            content: toImg(pictureRelLink + "project_icon_color.jpg")
        },
        {
            formType: "project",
            className: "form-colored-icon",
            content: toParagraph("An SVG icon, in color")
        },
        {
            formType: "project",
            className: "form-uncolored-icon",
            content: toParagraph("An SVG icon, in white")
        },
        {
            formType: "project",
            className: "form-photo-one",
            content: toParagraph("A photo for this posting")
        },
        {
            formType: "project",
            className: "form-photo-one-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "project",
            className: "form-photo-two",
            content: toParagraph("A photo for this posting")
        },
        {
            formType: "project",
            className: "form-photo-two-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "project",
            className: "form-photo-three",
            content: toParagraph("A photo for this posting")
        },
        {
            formType: "project",
            className: "form-photo-three-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "project",
            className: "form-roles",
            content: toParagraph("Choose the roles to associate with this posting")
        }];
    var roleTypeFieldsHelp = [
        {
            formType: "roleType",
            className: "form-name",
            content: toImg(pictureRelLink + "role_name.jpg")
        },
        {
            formType: "roleType",
            className: "form-tagline",
            content: toImg(pictureRelLink + "role_tagline.jpg")
        },
        {
            formType: "roleType",
            className: "form-short-description",
            content: toImg(pictureRelLink + "role_short_description.jpg")
        },
        {
            formType: "roleType",
            className: "form-long-description",
            content: toImg(pictureRelLink + "role_starting_description.jpg")
        },
        {
            formType: "roleType",
            className: "form-additional-description",
            content: toImg(pictureRelLink + "role_additional_description.jpg")
        },
        {
            formType: "roleType",
            className: "form-icon-color",
            content: toImg(pictureRelLink + "project_icon_color.jpg")
        },
        {
            formType: "roleType",
            className: "form-colored-icon",
            content: toParagraph("An SVG icon, in color")
        },
        {
            formType: "roleType",
            className: "form-uncolored-icon",
            content: toParagraph("An SVG icon, in white")
        },
        {
            formType: "roleType",
            className: "form-photo-one",
            content: toParagraph("A photo for this posting")
        },
        {
            formType: "roleType",
            className: "form-photo-one-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "roleType",
            className: "form-photo-two",
            content: toParagraph("A photo for this posting")
        },
        {
            formType: "roleType",
            className: "form-photo-two-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "roleType",
            className: "form-photo-three",
            content: toParagraph("A photo for this posting")
        },
        {
            formType: "roleType",
            className: "form-photo-three-text",
            content: toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "roleType",
            className: "form-roles",
            content: toParagraph("Choose the roles to associate with this posting")
        }];
    var roleFieldsHelp = [
        {
            formType: "role",
            className: "form-projects",
            content: toParagraph("Choose the projects to associate with this role")
        },
        {
            formType: "role",
            className: "form-role-types",
            content: toParagraph("Choose the role types to associate with this role")
        },
        {
            formType: "role",
            className: "form-role-name",
            content: toImg(pictureRelLink + "role_title.jpg")
        }
        ,
        {
            formType: "role",
            className: "form-role-description",
            content: toImg(pictureRelLink + "role_description.jpg")
        }

    ];

    if (_getFormType() === "Project") {
        init(projectFieldsHelp);
    } else if (_getFormType() === "Role Type") {
        init(roleTypeFieldsHelp);
    } else if (_getFormType() === "Role") {
        init(roleFieldsHelp);
    } else init([]);

});