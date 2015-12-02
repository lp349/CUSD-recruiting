/**
 * This file contains the scripts for list.html
 */

//the active tab (i.e. projects-tab, roletypes-tab...)
var activeTab = "";

//maps project ids to the original and new rankings
//format = {[PROJECT ID/PK]:{originalRank: [ORIGINAL RANK], newRank: [NEW RANK]}, ...}
var projectRankObj = {};


/**
 * Changes the link of the add button based on the active tab
 */
var changeAddButtonLink = function (activeTab) {
    if (activeTab === "projects-tab") {
        $(".add").attr("href", "/admin/add_project/");
    } else if (activeTab === "roletypes-tab") {
        $(".add").attr("href", "/admin/add_role_type/");
    } else if (activeTab === "roles-tab") {
        $(".add").attr("href", "/admin/add_role/");
    }
};


/**
 * Toggles publish/unpublish
 * @param posting_type : string, "project" or "role_type"
 * @param pk : number, posting id
 */
var togglePublish = function(posting_type, pk) {
    console.log("toggling publish");

    $.get("ajax/toggle_publish/" + posting_type + "/" + pk + "/" , function() {
        if (posting_type === "project") {
            $.get("/admin/ajax/"+ posting_type + "/", displayProjectList);
        }else if (posting_type === "role_type") {
            $.get("/admin/ajax/"+ posting_type + "/", displayRoleTypeList);
        }
    });
};


/**
 * Hides/Shows icons and buttons for rank change state
 */
var toggleElements = function() {
    if ($(".elem-button").is(":hidden")) {
        $(".elem-button").css("visibility", "visible").show();

    }else {
        $(".elem-button").css("visibility", "hidden").hide();
    }

    if ($(".expand-icon").is(":hidden")) {
        $(".expand-icon").css("visibility", "visible").show();
    }else {
        $(".expand-icon").css("visibility", "hidden").hide();
    }

};

/**
 * Hides the roles preview
 */
var hideAllQuickView = function() {
    $(".roles-quick-view").slideUp();
    $(".retract-icon").hide();
    $(".expand-icon").show();
};

/**
 * Contains logic for toggling delete buttons
 */
var activateDeleteHover = function () {
    $(".remove.button").css("visibility", "hidden");

    $(".elem").hover(function () {
        if (!isChangingRanks()) {
            $(this).children(".remove.button").css("visibility", "visible");
        }
    }, function () {
        $(this).children(".remove.button").css("visibility", "hidden");
    });

};

/**
 * Helper Method to generateElem()
 * @param posting : project object
 * @returns {string} project listing HTML to be displayed
 * @private
 */
function _generateProjectListing(posting) {
    var published = "Unpublish";
    if (!posting.published) published = "Publish";

    var roles = "<ul class='roles-quick-view'>";
    for (var i = 0; i < posting.roles.length; i++) {
        roles += "<li class='quick-view-elem'>" + posting.roles[i] + "</li>"
    };

    if (posting.roles.length === 0)
        roles += "<li class='quick-view-elem'>This project is not hiring.</li>";

    roles += "</ul>";

    var p = "<li class='project elem ui-state-default elem-"+published.toLowerCase()+ "' id='" + posting.id + "'>"
        + Icons.drag
        + "<a class='elem-button remove button' href='remove_project/" + posting.id + "/ "
        + "onclick=\"return confirm('Are you sure you want to delete this project?')\""
        +"'>"+ Icons.remove +"</a>"
        + "<span class='elem-name'>" + posting.name + "</span>"
        + "<span class='elem-short-name'>(css selector: " + posting.short_name + ")</span>"
        + "<div class='elem-button publish "+ published.toLowerCase() +" button'>" + published + "</div>"
        + "<a class='elem-button edit button' href='edit_project/" + posting.id + "/'>Edit</a>"
        + roles
        + Icons.expand
        + Icons.retract
        + "</li>";
    return p;
}

/**
 * Helper Method to generateElem()
 * @param posting : Role Type object
 * @returns {string} : role type listing html to be displayed
 * @private
 */
function _generateRoleTypeListing(posting) {
    var published = "Unpublish";
    if (!posting.published) published = "Publish";

    var roles = "<ul class='roles-quick-view'>";
    for (var i = 0; i < posting.roles.length; i++) {
        roles += "<li class='quick-view-elem'>" + posting.roles[i] + "</li>"
    };

    if (posting.roles.length === 0)
        roles += "<li class='quick-view-elem'>There are no roles under this category.</li>";

    roles += "</ul>";

    var rt = "<div class='role-type elem elem-"+published.toLowerCase()+ "' id='" + posting.id + "'>"
        + "<a class='elem-button remove button' href='remove_project/" + posting.id + "/' "
        +"onclick=\"return confirm('Are you sure you want to delete this role type?')\""
        +">"+ Icons.remove +"</a>"
        + "<span class='elem-name'>" + posting.name + "</span>"
        + "<span class='elem-short-name'>(css selector:" + posting.short_name + ")</span>"
        + "<div class='elem-button publish "+ published.toLowerCase() +" button'>" + published + "</div>"
        + "<a class='elem-button edit button' href='edit_role_type/" + posting.id + "/'>Edit</a>"
        + roles
        + Icons.expand
        + Icons.retract
        + "</div>";
    return rt;
}


/**
 * Helper Method to generateElem()
 * @param posting : role object
 * @returns {string} : role listing html to be displayed
 * @private
 */
function _generateRoleListing(posting) {
    var r = "<div class='role elem' id='" + posting.id + "'>"
        + "<a class='elem-button remove button' href='remove_role/" + posting.id + "/' "
        + "onclick=\"return confirm('Are you sure you want to delete this role?')\""
        + ">"+ Icons.remove +"</a>"
        + "<span class='elem-name'>" + posting.title + "</span>"
        + "<a class='elem-button edit button' href='edit_role/" + posting.id + "/'>Edit</a>"

        + "</div>";
    return r;
}


/**
 * Generate the listing html
 * @param typ : the type of listing (i.e. Project, RoleType, or Role)
 * @param posting : an object representation of the listing from the db,
 * containing an id and either
 *  1. a name (project or role type) or
 *  2. a title (role)
 * @returns {string}: the html for the listing, to add to the page
 */
function generateElem(typ, posting) {
    if (typ === "Project") {
        return _generateProjectListing(posting);
    } else if ((typ === "RoleType")) {
        return _generateRoleTypeListing(posting);
    } else if ((typ === "Opening")) {
        return _generateRoleListing(posting);
    }
}

/*
 See: http://stackoverflow.com/questions/19333098/403-forbidden-error-when-making-an-ajax-post-request-in-django-framework
*/
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
  }
    return cookieValue;
}


/**
 *
 * @param displayRank : project rank on page (lower "rank" = higher priority)
 * @param numProjects : number of projects
 * @return number: DB rank (higher the rank, the greater the priority)
 */
var convertToDBRank = function (displayRank, numProjects) {
    return numProjects - displayRank;
};


/**
 * @param dbRank : project rank in db (higher the rank, the greater the priority)
 * @param numProjects : number of projects
 * @return number : display rank ( project rank on page (lower "rank" = higher priority) )
 */
var convertToDisplayRank = function (displayRank, numProjects) {
    return numProjects - displayRank;
};


/**
 * This method requires that:
 * 1. project listings have unique integer ids
 * 2. projects tab is active (projects are being displayed and not roles or role types
 * If these requirements are satisfied, then the method will
 * fetch the current ranks of the projects on the page and populate
 * the new display ranks of the projectRankObj.
 */
var populateProjectRanks = function () {
    //get order of ids
    var idOrder = $("#sortable").sortable("toArray");
    $.each(idOrder, function (index, id) {
        var prevNewRank = projectRankObj[id]["newRank"];
        if (index !== prevNewRank) {
            projectRankObj[id]["newRank"] = index;
        }
    });
};

/**
 * Returns an array of objects of the following format:
 * {id: [projectId], rank: [newRank]}
 * where new_rank is a DB rank (higher rank = greater priority)
 * that correspond to objects with rank changes
 */
var getNewRanks = function () {
    populateProjectRanks();
    var changes = [];
    //iterate through all projects
    $.each(Object.keys(projectRankObj), function (index, projectId) {
        var newRank = projectRankObj[projectId]["newRank"];
        var originalRank = projectRankObj[projectId]["originalRank"];
        //if rank changed
        if (newRank !== originalRank) {
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
 * Determines whether sorting (project list) is enabled
 * @returns {boolean}
 */
var isChangingRanks = function() {
    return !($("#sortable").hasClass("ui-sortable-disabled") || activeTab !== "projects-tab");
};


/**
 * Toggles and handles sortable project list
 */
var displayProjectListHelper = function () {

    $(function () {
        $('#sortable').sortable()
            .disableSelection()
            .sortable("disable");

        $(".rank").hide();
        $(".edit-rank").show();
    });

    $(".edit-rank").click(function () {
        $(".rank").show();
        $(this).hide();
        $("#sortable").sortable("enable");
        $("#sortable li").css("cursor", "move");
        $(".drag-icon").show();
        hideAllQuickView();
        toggleElements();
    });


    $(".cancel-rank").click(function () {
        console.log(getNewRanks());
        $.get("/admin/ajax/project/", displayProjectList);

    });

    $(".save-rank").click(function () {
        $(".elem-button").removeClass("button-disabled");
        var rank_changes = JSON.stringify(getNewRanks());
        var csrftoken = getCookie('csrftoken');
        $.post("/admin/ajax/update_ranks", {csrfmiddlewaretoken: csrftoken, rank_string: rank_changes}, function () {
            $.get("/admin/ajax/project/", displayProjectList);
        });
    });

};


/**
 * 1. Sorts the given projects by rank
 * 2. Populates projectRankObj with ids and original rankings
 * 3. Adds project listings as sortable "li" elements
 * 4. Calls a helper method to toggle the sortable list
 * @param data : JSON representation of projects with relevant project info,
 *              retrieved from ajax call
 */
var displayProjectList = function (data) {
    var posts = JSON.parse(data);

    //sort by rank before display
    posts.sort(function (post1, post2) {
        if (post1.rank > post2.rank) return -1;
        return post1.rank < post2.rank;
    });

    var list_div = $("#content");
    list_div.empty();
    projectRankObj = {};

    //add edit, save, cancel rank buttons
    list_div
        .append("<div class='rank edit-rank'>Edit Rank</div>")
        .append("<div class='rank save-rank'>Save</div>")
        .append("<div class='rank cancel-rank'>Cancel</div>")
        .append("<ul id='sortable'>");

    //add the project listings
    for (var i = 0; i < posts.length; i++) {
        //list_div.append(generateElem("Project", posts[i]));
        $("#sortable").append(generateElem("Project", posts[i]));

        //populate projectRankObject with pks (project ids) and original ranks
        projectRankObj[posts[i].id] = {};
        projectRankObj[posts[i].id]["originalRank"] = i;
        projectRankObj[posts[i].id]["newRank"] = i;
    }

    //hide relevant buttons
    $(".roles-quick-view").hide();
    $(".drag-icon").hide();
    $(".retract-icon").hide();


    $(".publish.button").click( function() {
        console.log($(this).parent().attr("id"));
        togglePublish("project", $(this).parent().attr("id"));

    });

    //activateDeleteHover();

    //set up and handle toggling
    displayProjectListHelper();

};

/**
 * Displays the role types on page given data from ajax call
 * @param data : JSON representation of roletype objects
 */
var displayRoleTypeList = function (data) {
    var posts = JSON.parse(data);

    //sort alphabetically before display
    posts.sort(function (post1, post2) {
        if (post1.name < post2.name) return -1;
        return post1.name > post2.name;
    });

    var list_div = $("#content");
    list_div.empty();

    for (var i = 0; i < posts.length; i++) {
        //add role type
        list_div.append(generateElem("RoleType", posts[i]));
    }

    //hide relevant buttons
    $(".roles-quick-view").hide();
    $(".drag-icon").hide();
    $(".retract-icon").hide();


    $(".publish.button").click( function() {
        console.log($(this).parent().attr("id"));
        togglePublish("role_type", $(this).parent().attr("id"));
    });

    //activateDeleteHover();

};

/**
 * Displays the roles on page given data from ajax call
 * @param data : JSON representation of roles objects
 */
var displayRoleList = function (data) {
    var posts = JSON.parse(data);

    //sort roles alphabetically before display
    posts.sort(function (post1, post2) {
        if (post1.title < post2.title) return -1;
        return post1.title > post2.title;
    });

    var list_div = $("#content");
    list_div.empty();

    //display roles on page
    for (var i = 0; i < posts.length; i++) {
        list_div.append(generateElem("Opening", posts[i]));
    }

    //activateDeleteHover();
};

$(document).ready(function () {

    //handle navigation bar
    $('#nav-bar').on('click', '.tab', function () {
        //tab click styling
        $('.tab').removeClass('selected-tab');
        $(this).addClass('selected-tab');

        //save activetab ->
        // this tab will be active the next time this page is accessed
        activeTab = $(this).attr("id");
        sessionStorage['active'] = activeTab;

        //set link for add button
        changeAddButtonLink(activeTab);
    });

    //render postings and roles elements
    $("#projects-tab").click(function () {
        $.get("/admin/ajax/project/", displayProjectList);
    });

    $("#roles-tab").click(function () {
        $.get("/admin/ajax/roles", displayRoleList);
    });

    $("#roletypes-tab").click(function () {
        $.get("/admin/ajax/role_type", displayRoleTypeList);
    });

    //toggle roles preview for projects and role types
    $('#content').on('click', '.elem', function () {
        if (!isChangingRanks()) {
            if ($(this).children(".roles-quick-view").is(":hidden")) {
                //listing was not expanded
                //hide all previews first
                hideAllQuickView();

                //show the roles associated with clicked listing
                $(this).children(".roles-quick-view").slideDown();
                $(this).children(".retract-icon").show();
                $(this).children(".expand-icon").hide();

            } else {
                //clicked listing is already expanded,
                // hide the roles associated with clicked listing
                hideAllQuickView();
            }
        }
    });

    //go to last active tab (the tab that was last accessed, if any)
    if (sessionStorage['active']) {
        $("#" + sessionStorage['active']).trigger("click");
    } else {
        $("#projects-tab").trigger("click");
    }

});
