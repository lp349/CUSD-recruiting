function validate() {
    //@todo
    return false;
}

$(document).ready(function () {

    $("#id_published").parent().parent().hide(); ///hide "published" field...

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