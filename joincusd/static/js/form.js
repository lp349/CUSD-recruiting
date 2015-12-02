function validate() {
    //@todo
    return false;
}

$(function() {
    $( document ).tooltip();
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
        return "Project";
    }
    if ($(formContentDivClass).hasClass("role-form-content")) {
        return "Role";
    }

    if($(formContentDivClass).hasClass("application-form-content")) {
        return "Application";
    }

    return "Error: Cannot determine form type"
}


/**
 * Returns whether it's an editing form or adding form
 * @returns {string} "Add" or "Edit"
 */
function _getFormState() {
    if ($(".form-title").html().trim().indexOf("Edit")==0) {
        return "Edit";
    }
    return "Add";
}

function _toImg(link) {
    return "<img src='" + link + "'/>"
}

function _toParagraph(str) {
    return "<p>" + str + "</p>";
}

function _setAdminRequiredFields() {
    var setInputRequired = function(input) {
        $(input).prop('required',true)
            .closest(".field-wrapper")
            .children(".field-name").append("<span class=\"require\">*</span>");

    };

    var unSetRequired = function(input) {
        $(input).prop('required',false)
            .closest(".field-wrapper")
            .children(".field-name span.require").remove();

    };

    setInputRequired("input:visible");
    setInputRequired("textarea");

    if (_getFormState() == "Edit") {
        unSetRequired("input:file");
    }

    if (_getFormType() == "Role") {
        $("input:checkbox")
            .closest(".field-wrapper.form-projects")
            .children(".field-name").append("<span class=\"require\">*</span>");
    }
}


function _setApplicationRequiredFields() {
    var setInputRequired = function(input) {
        $(input).prop('required',true)
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

    $.each(fieldsData, function(index, field) {
        $("." + field.className + " .field-name .help-button")
            .prop("title", field.className)
            .tooltip({
                tooltipClass: "tooltip",
                content: field.content,
                position: { my: "left+15 center", at: "right center", collision: 'none'},
                hide: false
            }).append(Icons.help);
    });
}

/**
 * Sets up Error Messages display and events
 */
function _setErrorMessages() {
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
    $("#id_published").parent().parent().hide(); ///hide "published" field...

    //set up checkboxes
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

    if (_getFormType() !== "Application") {
        _setAdminRequiredFields();
    } else {
        _setApplicationRequiredFields();
    }

    _setHelpTips(fieldsData);
    _setErrorMessages();

}



$(document).ready(function () {
    var pictureRelLink = "/static/images/user_guide_picture/";
    var formFieldsHelp = [
        {
            className:"form-name",
            content: _toImg(pictureRelLink + "project_name.jpg")
        },
        {
            className: "form-tagline",
            content: _toImg(pictureRelLink + "project_tagline.jpg")
        },
        {
            className:"form-short-description",
            content: _toImg(pictureRelLink + "project_short_description.jpg")
        },
        {
            className: "form-long-description",
            content: _toImg(pictureRelLink + "project_starting_description.jpg")
        },
        {
            className: "form-additional-description",
            content:  _toImg(pictureRelLink + "project_additional_description.jpg")
        },
        {
            className:"form-icon-color",
            content: _toImg(pictureRelLink + "project_icon_color.jpg")
        },
        {
            className:"form-colored-icon",
            content: _toParagraph("An SVG icon, in color")
        },
        {
            className: "form-uncolored-icon",
            content: _toParagraph("An SVG icon, in white")
        },
        {
            className: "form-photo-one",
            content: _toParagraph("A photo for this posting")
        },
        {
            className: "form-photo-one-text",
            content: _toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            className:  "form-photo-two",
            content: _toParagraph("A photo for this posting")
        },
        {
            className: "form-photo-two-text",
            content: _toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            className: "form-photo-three",
            content: _toParagraph("A photo for this posting")
        },
        {
            className: "form-photo-three-text",
            content: _toParagraph("A text description of the photo above,<br> for accessibility purposes")
        },
        {
            className: "form-roles",
            content: _toParagraph("Choose the roles to associate with this posting")
        },

        {
            className: "form-projects",
            content: _toParagraph("Choose the projects to associate with this role")
        },
        {
            className: "form-role-types",
            content: _toParagraph("Choose the role types to associate with this role")
        },
        {
            className: "form-role-name",
            content: _toImg(pictureRelLink + "role_title.jpg")
        }
        ,
        {
            className: "form-role-description",
            content: _toImg(pictureRelLink + "role_description.jpg")
        }

    ];
    init(formFieldsHelp);

});