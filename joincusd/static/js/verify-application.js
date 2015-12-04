function generateElem(netId, resumeURL, projectList, roleList) {
    return "<p>" + netId + "</p>" + "<p>" + resumeURL + "</p>"  + "<p>" + projectList + "</p>" + "<p>" + roleList + "</p>" + "<br>"
}

function displayApplicantData(data) {
    data = JSON.parse(data);
    var displayHandler =  "#content";
    var sort = function (post1, post2) {
        if (post1.netID < post2.netID) return -1;
        return (post1.netID > post2.netID);
    };

    data.sort(sort);

    $.each(data, function(index, applicant) {
        $(displayHandler).append(generateElem(applicant.netID, applicant.resumeURL, applicant.projectList, applicant.roleList));
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