$(function () {
    $(document).tooltip(); //activate tooltips
});

/**
 * Description: Returns the type of form
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
 * Description: Returns whether it's an editing form or adding form
 * @returns {string} "Add" or "Edit"
 */
function _getFormState() {
    if ($(".form-title").html().trim().indexOf("Edit") == 0) {
        return "Edit";
    }
    return "Add";
}

function toTooltipImg(link) {
    return "<img class=\"ui-tooltip-img\" src='" + link + "'/>";
}

function toTooltipParagraph(str) {
    return "<p class=\"ui-tooltip-text\" >" + str + "</p>";
}

/**
 * Description: given an input field,
 *              sets the input to required
 *              and adds an asterisk at the end of the field label
 * @param input
 */
var addInputRequired  = function(input) {
    $(input).prop('required', true)
        .closest(".field-wrapper")
        .children(".field-name")
        .append("<span class=\"require\">*</span>");
};


/**
 * Description: given an input field,
 *              sets the input to required
 *              and shows asterisk at the end of the field label
 * @param input
 */
var setInputRequired = function (input) {
    $(input).prop('required', true)
        .closest(".field-wrapper")
        .children(".field-name")
        .children("span.require")
        .show();


};

/**
 * Description: given an input field,
 *              removes the 'required' property
 *              and hides asterisk at the end of the field label
 * @param input
 */
var unSetRequired = function (input) {
    $(input).prop('required', false)
        .closest(".field-wrapper")
        .children(".field-name")
        .children("span.require")
        .hide();
};

/**
 * Description: sets up photo and icon toggling based on the following requirements/assumptions:
 *              1. Photos are not required (at least when adding),
 *                  but their alt texts are required if a photo is provided
 *              2. When editing, if a photo is chosen, then subsequently removed,
 *                  the preview should show the original photo
 *              3. Photos and Icons should have previews even when adding a posting
 *
 * @private
 */
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

    //deal with caption-photo logic
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
 * Description: Set up required fields for admin forms
 *              All fields (except checkboxes) are required by default except:
 *                     1. if the form type is role : selecting projects is required for roles
 *                     2. if the form type is projects or role type:
 *                              there are special logic/requirements for photos and icons
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

    //need to do some custom logic for role vs posting forms
    if (_getFormType() == "Role") {
        //selecting projects is required for role form
        //but role types isn't required
        $("input:checkbox")
            .closest(".field-wrapper.form-projects")
            .children(".field-name").append("<span class=\"require\">*</span>");
    } else {
        //not a role form, which means there are photos
        //set up photos and icons previews
        // and toggle caption requirement for photos
        _setPhotosAndIcons();
    }

}


/**
 * Description Set up required fields for applicant form (add/edit roles, projects, role types)
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
 * Description: Sets tool tips (the help tips that display when you hover over a help icon)
 *
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
 * Description: Sets up (appends) error messages and their events for forms
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
 * Description: Initiates form given an array of tooltip data
 *
 * @param fieldsData : Object (array) of objects each in the format
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
        _setHelpTips(fieldsData);
    } else {
        _setApplicationRequiredFields();
    }
    _setErrorMessages();

}

$(document).ready(function () {
    //relative location of images
    var pictureRelLink = "/static/images/user_guide_picture/";

    var projectFieldsHelp = [
        {
            formType: "project",
            className: "form-name",
            content: toTooltipImg(pictureRelLink + "project_name.jpg")
        },
        {
            formType: "project",
            className: "form-tagline",
            content: toTooltipImg(pictureRelLink + "project_tagline.jpg")
        },
        {
            formType: "project",
            className: "form-short-description",
            content: toTooltipImg(pictureRelLink + "project_short_description.jpg")
        },
        {
            formType: "project",
            className: "form-long-description",
            content: toTooltipImg(pictureRelLink + "project_starting_description.jpg")
        },
        {
            formType: "project",
            className: "form-additional-description",
            content: toTooltipImg(pictureRelLink + "project_additional_description.jpg")
        },
        {
            formType: "project",
            className: "form-icon-color",
            content: toTooltipParagraph("The color of the icon for this posting")
        },
        {
            formType: "project",
            className: "form-colored-icon",
            content: toTooltipParagraph("An SVG icon, in the color above")
        },
        {
            formType: "project",
            className: "form-uncolored-icon",
            content: toTooltipParagraph("An SVG icon, in white")
        },
        {
            formType: "project",
            className: "form-photo-one",
            content: toTooltipParagraph("A photo for this posting")
        },
        {
            formType: "project",
            className: "form-photo-one-text",
            content: toTooltipParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "project",
            className: "form-photo-two",
            content: toTooltipParagraph("A photo for this posting")
        },
        {
            formType: "project",
            className: "form-photo-two-text",
            content: toTooltipParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "project",
            className: "form-photo-three",
            content: toTooltipParagraph("A photo for this posting")
        },
        {
            formType: "project",
            className: "form-photo-three-text",
            content: toTooltipParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "project",
            className: "form-roles",
            content: toTooltipParagraph("Choose the roles to associate with this posting")
        }];
    var roleTypeFieldsHelp = [
        {
            formType: "roleType",
            className: "form-name",
            content: toTooltipImg(pictureRelLink + "role_name.jpg")
        },
        {
            formType: "roleType",
            className: "form-tagline",
            content: toTooltipImg(pictureRelLink + "role_tagline.jpg")
        },
        {
            formType: "roleType",
            className: "form-short-description",
            content: toTooltipImg(pictureRelLink + "role_short_description.jpg")
        },
        {
            formType: "roleType",
            className: "form-long-description",
            content: toTooltipImg(pictureRelLink + "role_starting_description.jpg")
        },
        {
            formType: "roleType",
            className: "form-additional-description",
            content: toTooltipImg(pictureRelLink + "role_additional_description.jpg")
        },
        {
            formType: "roleType",
            className: "form-icon-color",
            content: toTooltipParagraph("The color of the icon for this posting")
        },
        {
            formType: "roleType",
            className: "form-colored-icon",
            content: toTooltipParagraph("An SVG icon, in the color above")
        },
        {
            formType: "roleType",
            className: "form-uncolored-icon",
            content: toTooltipParagraph("An SVG icon, in white")
        },
        {
            formType: "roleType",
            className: "form-photo-one",
            content: toTooltipParagraph("A photo for this posting")
        },
        {
            formType: "roleType",
            className: "form-photo-one-text",
            content: toTooltipParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "roleType",
            className: "form-photo-two",
            content: toTooltipParagraph("A photo for this posting")
        },
        {
            formType: "roleType",
            className: "form-photo-two-text",
            content: toTooltipParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "roleType",
            className: "form-photo-three",
            content: toTooltipParagraph("A photo for this posting")
        },
        {
            formType: "roleType",
            className: "form-photo-three-text",
            content: toTooltipParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            formType: "roleType",
            className: "form-roles",
            content: toTooltipParagraph("Choose the roles to associate with this posting")
        }];
    var roleFieldsHelp = [
        {
            formType: "role",
            className: "form-projects",
            content: toTooltipParagraph("Choose the projects to associate with this role")
        },
        {
            formType: "role",
            className: "form-role-types",
            content: toTooltipParagraph("Choose the role types to associate with this role")
        },
        {
            formType: "role",
            className: "form-role-name",
            content: toTooltipImg(pictureRelLink + "role_title.jpg")
        }
        ,
        {
            formType: "role",
            className: "form-role-description",
            content: toTooltipImg(pictureRelLink + "role_description.jpg")
        }

    ];

    if (_getFormType() === "Project") {
        init(projectFieldsHelp);
    } else if (_getFormType() === "Role Type") {
        init(roleTypeFieldsHelp);
    } else if (_getFormType() === "Role") {
        init(roleFieldsHelp);
    } else init([]); //in application form

});