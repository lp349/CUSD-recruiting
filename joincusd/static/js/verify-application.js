var elemSelector = ".elem";
var displaySelector =  "#content";
var netIDSelector = ".netID";
var applicantFieldClasses = "applicant-field";
var applicantFieldNameClasses = "applicant-field-name";
var applicantElemClasses = elemSelector.substring(1) + " applicant-elem";

function generateElem(applicantObject) {
    var netID = applicantObject.netID;
    var resume = applicantObject.resumeURL;
    var projectList = applicantObject.projectList.toString().split(",").join(", ");
    var roleList = applicantObject.roleList.toString().split(",").join(", ");
    var elemClass = applicantElemClasses;
    var netIDClass = netIDSelector.substring(1);
    var otherApplicantFields = "applicant-other-fields";

    var elem = $("<div>")
        .addClass(elemClass)
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


[{
    "roleList": ["Architect", "Photographer", "Software Engineer", "Entrepreneurial Analyst"],
    "projectList": ["Green Building Metrics Project", "Sustainable Education Ghana"],
    "resumeURL": "/uploads/resumes/2534863669.pdf",
    "netID": "dg522"
}, {
    "roleList": ["Landscape Architect", "Videographer", "Mobile Developer"],
    "projectList": ["Sustainable Education Ghana"],
    "resumeURL": "/uploads/resumes/2534863669_T7tmNA8.pdf",
    "netID": "ah662"
}, {
    "roleList": ["UX/Product Designer", "Interior Designer", "Videographer", "Power Engineer"],
    "projectList": ["Overlook Ridge Development", "Cornell Tech"],
    "resumeURL": "/uploads/resumes/CS4780HW3Writeup_1.pdf",
    "netID": "waffles"
}, {
    "roleList": ["Research Analyst (Cost)"],
    "projectList": ["Overlook Ridge Development", "Climate Action Plan", "sustainable food systems"],
    "resumeURL": "/uploads/resumes/2534863669_gsaAtFb.pdf",
    "netID": "wfl"
}]