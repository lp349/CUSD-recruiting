var elemSelector = ".elem";
var displaySelector =  "#content";
var netIDSelector = ".netID";
var applicantFieldClasses = "applicant-field";
var applicantFieldNameClasses = "applicant-field-name";
var applicantElemClasses = elemSelector.substring(1) + " applicant-elem";
var otherApplicantFields = "applicant-other-fields";

function generateElem(applicantObject) {
    var netID = applicantObject.netID;
    var resume = applicantObject.resumeURL;
    var projectList = applicantObject.projectList.toString().split(",").join(", ");
    var roleList = applicantObject.roleList.toString().split(",").join(", ");
    var netIDClass = netIDSelector.substring(1);

    var elem = $("<div>")
        .addClass(applicantElemClasses)
        .appendTo(displaySelector);

    var netIDField = $("<p>")
        .addClass(netIDClass)
        .html(netID)
        .appendTo(elem);

    var otherFields = $("<div>")
        .addClass(otherApplicantFields)
        .appendTo(elem);

    var resumeField = $("<p>")
        .addClass(applicantFieldClasses)
        .html(resume).appendTo(otherFields);

    var projectListField = $("<p>")
        .addClass(applicantFieldClasses)
        .html(projectList).appendTo(otherFields);

    var roleListField = $("<p>")
        .addClass(applicantFieldClasses)
        .html(roleList).appendTo(otherFields);

    $("<span>")
        .addClass(applicantFieldNameClasses)
        .html("Resume: ")
        .prependTo(resumeField);

    $("<span>")
        .addClass(applicantFieldNameClasses)
        .html("Roles: ")
        .prependTo(roleListField);

    $("<span>")
        .addClass(applicantFieldNameClasses)
        .html("Projects: ")
        .prependTo(projectListField);
}

function displayApplicantData(data) {
    data = JSON.parse(data);
    var sort = function (post1, post2) {
        if (post1.netID < post2.netID) return -1;
        return (post1.netID > post2.netID);
    };

    data.sort(sort);

    $.each(data, function(index, applicant) {
        generateElem(applicant);
    })
}

$(document).ready(function () {
    $.get("/admin/ajax/app", displayApplicantData);
});