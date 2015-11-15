/**
 * This file contains the scripts for list.html
 */

//the active tab
var activeTab = "";

//maps project ids to the original and new rankings
var projectRankObj = {};

/**
 * Changes the link of the add button based on the active tab
 */
var changeAddButtonLink = function(activeTab) {
            if (activeTab === "projects-tab") {
                $(".add").attr("href", "/admin/add_project/");
            }else if (activeTab === "roletypes-tab") {
                $(".add").attr("href", "/admin/add_role_type/");
            }else if (activeTab === "roles-tab") {
                $(".add").attr("href", "/admin/add_role/");
            }
        };

/**
 * Generate a listing
 * @param typ : the type of listing (i.e. Project, RoleType, or Role)
 * @param posting : an object representation of the listing from the db,
 * containing an id and either
 *  1. a name (project or role type) or
 *  2. a title (role)
 * @returns {string}: the html for the listing, to add to the page
 */
function generateElem(typ, posting) {

    if (typ === "Project") {

        var dragIcon = '<svg class="drag-icon" viewBox="0 0 100 100"> ' +
            '<path d="M 50 85 l 20 20 l -40 0 z" transform="rotate(180,50,85)"></path>' +
            '<path d="M 50 15 l 20 20 l -40 0 z"></path>' +
            '<rect width="15" height="45" x="42.5" y="30" fill="#000"></rect>' +
            '</svg>';

        var roles = "<ul class='roles-quick-view'>";
        for (var i=0; i< posting.roles.length; i++) {
            roles += "<li class='quick-view-elem'>" + posting.roles[i] +"</li>"
        };
        roles += "</ul>";

        var p = "<li class='project elem ui-state-default' id='" + posting.id + "'>"
                + dragIcon
            + "<span class='elem-name'>" + posting.name + "</span>"
            + "<a class='edit button' href='edit_project/" + posting.id +"/'>Edit</a>"
            + "<a class='remove button' href='remove_project/" + posting.id + "/'>Remove</a>"
            + roles
            + "</li>";
        return p;
    } else if ((typ === "RoleType")) {
        var roles = "<ul class='roles-quick-view'>";
        for (var i=0; i< posting.roles.length; i++) {
            roles += "<li class='quick-view-elem'>" + posting.roles[i] +"</li>"
        };
        roles += "</ul>";

        var rt = "<div class='role-type elem' id='" + posting.id + "'>"
            + "<span class='elem-name'>" + posting.name + "</span>"
            + "<a class='edit button' href='edit_role_type/" + posting.id +"/'>Edit</a>"
            + "<a class='remove button'"
            + " onclick= deleteConfirmation(" + posting.name + ")"
            +" href='remove_role_type/" + posting.id + "/'>Remove</a>"
            + roles
            + "</div>";
        return rt;
    } else if ((typ === "Opening")) {
        var r = "<div class='role elem' id='" + posting.id + "'>"
            + "<span class='elem-name'>" + posting.title + "</span>"
            + "<a class='edit button' href='edit_role/" + posting.id +"/'>Edit</a>"
            + "<a class='remove button'"
            + " onclick= 'return deleteConfirmation(" + posting.title + ");'"
            +" href='remove_role/" + posting.id + "/'>Remove</a>"
            + "</div>";
        return r;
    }
}


var display_project_helper = function() {
    //from:
    // http://stackoverflow.com/questions/2442232/getting-the-position-of-the-element-in-a-list-when-its-drag-dropped-ui-sortabl/2443081#2443081

    $(function() {
        $('#sortable').sortable(
            /**{
            start: function(event, ui) {
                var startPosition = ui.item.index();
                ui.item.data('startingPosition', startPosition);
                console.log( startPosition);
            },
            update: function(event, ui) {
                var startPosition = ui.item.data('startingPosition');
                var endPosition = ui.item.index();
                var projectId = $(($(ui.item)[0])).attr("id");
                projectRankObj[projectId]["newRank"] = endPosition;
                console.log(projectRankObj);
                console.log(startPosition + ' - ' +endPosition);

            }
        }**/
        );

        $( ".selector" ).on( "sortstart", function( event, ui ) {} );

        $( "#sortable" ).disableSelection();
        $( ".rank").hide();
        $( ".edit-rank").show();
        $( "#sortable" ).sortable("disable");

    });

    $(".edit-rank").click( function() {
        $(".rank").show();
        $(this).hide();
        $( "#sortable" ).sortable("enable");
        $("#sortable li").css("cursor", "move");
        $(".drag-icon").show();
    });

    $(".cancel-rank").click( function() {
        //$(".drag-icon").hide();
        //$( ".rank").hide();
        //$( ".edit-rank").show();
        //$( "#sortable" ).sortable("cancel").sortable("disable");
        //$("#sortable li").css("cursor", "pointer");
        console.log(getNewRanks());
        $.get("/admin/ajax/project/", display_project_list);

    });
};


/**
 *
 * @param displayRank : project rank on page (lower "rank" = higher priority)
 * @param numProjects : number of projects
 * @return number: DB rank (higher the rank, the greater the priority)
 */
var convertToDBRank = function(displayRank, numProjects) {
    return numProjects - displayRank;
}


/**
 * @param dbRank : project rank in db (higher the rank, the greater the priority)
 * @param numProjects : number of projects
 * @return number : display rank ( project rank on page (lower "rank" = higher priority) )
 */
var convertToDisplayRank = function(displayRank, numProjects) {
    return numProjects - displayRank;
}

/**
 * This method requires that:
 * 1. project listings have unique integer ids
 * 2. projects tab is active (projects are being displayed and not roles or role types
 * If these requirements are satisfied, then the method will
 * fetch the current ranks of the projects on the page and populate
 * the new display ranks of the projectRankObj.
 */
var populateProjectRanks = function() {
    //get order of ids
    var idOrder = $("#sortable").sortable("toArray");
    $.each(idOrder, function(index, id) {
        var prevNewRank = projectRankObj[id]["newRank"];
        if (index !== prevNewRank) {
            projectRankObj[id]["newRank"] = index;
        }
    });
};

/**
 * Returns an array of objects of the following format:
 * {id: [project_id], rank: [new_rank]}
 * that correspond to objects with rank changes
 */
var getNewRanks = function() {
    populateProjectRanks();
    var changes = [];
    //iterate through all projects
    $.each(Object.keys(projectRankObj), function (index, projectId) {
        var newRank = projectRankObj[projectId]["newRank"];
        var originalRank = projectRankObj[projectId]["originalRank"];
        //if rank changed
        if ( newRank !== originalRank) {
            //add to array
           changes.push({
               projectId: projectId,
               newRank: convertToDBRank(newRank, Object.keys(projectRankObj).length)
           });
        }
    });

    return changes;
};

/**
 * 1. Sorts the given projects by rank
 * 2. Populates projectRankObj with ids and original rankings
 * 3. Adds project listings as sortable "li" elements
 * 4. Calls a helper method to toggle the sortable list
 * @param data : JSON representation of projects with relevant project info,
 *              retrieved from ajax call
 */
var display_project_list = function (data) {
    var posts = JSON.parse(data);
    //@todo: sort posts by rank
    var list_div = $("#content");
    list_div.empty();
    projectRankObj = {};


    var displayString = "";
    displayString += "<div class='rank edit-rank'>Edit Rank</div>";
    displayString += "<div class='rank save-rank'>Save</div>";
    displayString += "<div class='rank cancel-rank'>Cancel</div>";
    displayString += "<ul id='sortable'>";

    for (var i = 0; i < posts.length; i++) {

        //list_div.append(generateElem("Project", posts[i]));
        displayString += generateElem("Project", posts[i]);
        projectRankObj[posts[i].id] = {};
        projectRankObj[posts[i].id]["originalRank"] = i;
        projectRankObj[posts[i].id]["newRank"] = i;

        $("#" + i).data("roles", posts[i].roles);
    }

    displayString += "</ul>";

    list_div.append(displayString);
    $(".roles-quick-view").hide();
    $(".drag-icon").hide();
    display_project_helper();

};

var display_roletype_list = function (data) {
    var posts = JSON.parse(data);
    var list_div = $("#content");
    list_div.empty();

    for (var i = 0; i < posts.length; i++) {
        list_div.append(generateElem("RoleType", posts[i]));
    }

    $(".roles-quick-view").hide();
};

var display_role_list = function (data) {
    var posts = JSON.parse(data);
    var list_div = $("#content");
    list_div.empty();

    for (var i = 0; i < posts.length; i++) {
        list_div.append(generateElem("Opening", posts[i]));
    }
};

$(document).ready(function () {



    //tab click styling
    $('#nav-bar').on('click', '.tab', function () {
        $('.tab').removeClass('selected-tab');
        $(this).addClass('selected-tab');
        activeTab = $(this).attr("id");
        sessionStorage['active'] = activeTab;
        changeAddButtonLink(activeTab);
    });

    //render postings and roles elements
    $("#projects-tab").click(function () {
        $.get("/admin/ajax/project/", display_project_list);
    });

    $("#roles-tab").click(function () {
        $.get("/admin/ajax/roles", display_role_list);
    });

    $("#roletypes-tab").click(function () {
        $.get("/admin/ajax/role_type", display_roletype_list);
    });



    //element click styling
    $('#content').on('click', '.elem', function () {
        $('.elem').removeClass('selected-elem');
        $(this).addClass('selected-elem');
        if ($(this).children(".roles-quick-view").is(":hidden")){
            $(".roles-quick-view").slideUp();
            $(this).children(".roles-quick-view").slideDown();
        }else {
            $(this).children(".roles-quick-view").slideUp();
        }

    });

    //edit and remove buttons
    $('.remove.button').on('click', function () {
        if (conf) parent.remove();
    });

    $('.edit.button').on('click', function () {
        var parent = $(this).parent();
        var name = $("#" + parent.attr("id") + " span").html();
        alert(name + ": DoStuffs xD")

    });

    if (sessionStorage['active']) {
        $("#" + sessionStorage['active']).trigger("click");
    }else {
        $("#projects-tab").trigger("click");
    }


});
