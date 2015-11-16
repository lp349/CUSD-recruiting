/**
 * This file contains the scripts for list.html
 */

//the active tab (i.e. projects-tab, roletypes-tab...)
var activeTab = "";

//maps project ids to the original and new rankings
//format = {[PROJECT ID/PK]:{originalRank: [ORIGINAL RANK], newRank: [NEW RANK]}, ...}
var projectRankObj = {};

/**
 * SVG Icons
 * @type {{drag: string, expand: string, retract: string, remove: string}}
 */
var Icons = {

    drag: '<svg class="drag-icon" viewBox="0 0 100 100"> ' +
    '<path d="M 50 85 l 20 20 l -40 0 z" transform="rotate(180,50,85)"></path>' +
    '<path d="M 50 15 l 20 20 l -40 0 z"></path>' +
    '<rect width="15" height="45" x="42.5" y="30" fill="#000"></rect>' +
    '</svg>',

    expand: '<svg class="expand-icon" viewBox="0 0 100 100"> ' +
    '<path d="M 50 75 l 50 50 l -100 0 z" transform="rotate(180,50,75)"></path>' +

    '</svg>',

    retract: '<svg class="retract-icon" viewBox="0 0 100 100"> ' +
    '<path d="M 50 25 l 50 50 l -100 0 z"></path>' +
    '</svg>',

    remove:  '<svg class="remove-icon" viewBox="0 0 100 100"> ' +
    '<circle stroke-width="5px" cx="50%" cy="50%" r="48%"></circle>' +
    '<text  x="50%" y="50%" text-anchor="middle" dominant-baseline="central">x</text> ' +
    '</svg>'
};

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
            $.get("/admin/ajax/"+ posting_type + "/", display_project_list);
        }else if (posting_type === "role_type") {
            $.get("/admin/ajax/"+ posting_type + "/", display_roletype_list);
        }
    });
};


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
    var published = "Unpublish";
    if (!posting.published) published = "Publish";

    if (typ === "Project") {

        var roles = "<ul class='roles-quick-view'>";
        for (var i = 0; i < posting.roles.length; i++) {
            roles += "<li class='quick-view-elem'>" + posting.roles[i] + "</li>"
        };

        if (posting.roles.length === 0)
            roles += "<li class='quick-view-elem'>This project is not hiring.</li>";

        roles += "</ul>";

        var p = "<li class='project elem ui-state-default elem-"+published.toLowerCase()+ "' id='" + posting.id + "'>"
            + Icons.drag
            + "<a class='elem-button remove button' href='remove_project/" + posting.id + "/'>"+ Icons.remove +"</a>"
            + "<span class='elem-name'>" + posting.name + "</span>"
            + "<a class='elem-button edit button' href='edit_project/" + posting.id + "/'>Edit</a>"
            + "<div class='elem-button publish "+ published.toLowerCase() +" button'>" + published + "</div>"

            + roles
            + Icons.expand
            + Icons.retract
            + "</li>";
        return p;
    } else if ((typ === "RoleType")) {
        var roles = "<ul class='roles-quick-view'>";
        for (var i = 0; i < posting.roles.length; i++) {
            roles += "<li class='quick-view-elem'>" + posting.roles[i] + "</li>"
        };

        if (posting.roles.length === 0)
            roles += "<li class='quick-view-elem'>There are no roles under this category.</li>";

        roles += "</ul>";

        var rt = "<div class='role-type elem elem-"+published.toLowerCase()+ "' id='" + posting.id + "'>"
            + "<a class='elem-button remove button' href='remove_project/" + posting.id + "/'>"+ Icons.remove +"</a>"
            + "<span class='elem-name'>" + posting.name + "</span>"
            + "<a class='elem-button edit button' href='edit_role_type/" + posting.id + "/'>Edit</a>"
            + "<div class='elem-button publish "+ published.toLowerCase() +" button'>" + published + "</div>"
            + roles
            + Icons.expand
            + Icons.retract
            + "</div>";
        return rt;
    } else if ((typ === "Opening")) {
        var r = "<div class='role elem' id='" + posting.id + "'>"
            + "<a class='elem-button remove button' href='remove_project/" + posting.id + "/'>"+ Icons.remove +"</a>"
            + "<span class='elem-name'>" + posting.title + "</span>"
            + "<a class='elem-button edit button' href='edit_role/" + posting.id + "/'>Edit</a>"

            + "</div>";
        return r;
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
 * Hides/Shows icons and buttons for rank change state
 */
var toggleElements = function() {
    if ($(".elem-button").is(":hidden")) {
        $(".elem-button").css("visibility", "visible");
    }else {
        $(".elem-button").css("visibility", "hidden");
    }

    if ($(".expand-icon").is(":hidden")) {
        $(".expand-icon").css("visibility", "visible");
    }else {
        $(".expand-icon").css("visibility", "hidden");
    }

};

/**
 * Toggles and handles sortable project list
 */
var display_project_helper = function () {

    $(function () {
        $('#sortable').sortable();
        $(".selector").on("sortstart", function (event, ui) {
        });
        $("#sortable").disableSelection();
        $(".rank").hide();
        $(".edit-rank").show();
        $("#sortable").sortable("disable");

    });

    $(".edit-rank").click(function () {
        $(".rank").show();
        $(this).hide();
        $("#sortable").sortable("enable");
        $("#sortable li").css("cursor", "move");
        $(".drag-icon").show();
        toggleElements();
    });


    $(".cancel-rank").click(function () {
        console.log(getNewRanks());
        $.get("/admin/ajax/project/", display_project_list);

    });

    $(".save-rank").click(function () {
        $(".elem-button").removeClass("button-disabled");
        //console.log(JSON.stringify(getNewRanks()));
        var rank_changes = JSON.stringify(getNewRanks());
        var csrftoken = getCookie('csrftoken');
        $.post("/admin/ajax/update_ranks", {csrfmiddlewaretoken: csrftoken, rank_string: rank_changes}, function () {
            //$(".cancel-rank").hide();
            //$(".save-rank").hide();
            //$(".edit-rank").show();
            //toggleElements();
            //display_project_list();
            $.get("/admin/ajax/project/", display_project_list);
        });
    });

};


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


var activateDeleteHover = function () {
    $(".remove.button").css("visibility", "hidden");

    $(".elem").hover(function () {
        if (!isChangingRanks()) {
            $(this).children(".remove.button").css("visibility", "visible");
            $(".remove-icon").hover(function() {
                console.log("svg hovered");
                $(this).addClass("remove-svg-hover");
                console.log($(this).hasClass("remove-svg-hover"))
            })
        }
    }, function () {
        $(this).children(".remove.button").css("visibility", "hidden");
    });


};


/**
 * Determines whether sorting is enabled
 * @returns {boolean}
 */
var isChangingRanks = function() {
    return !($("#sortable").hasClass("ui-sortable-disabled") || activeTab !== "projects-tab");
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

    //sort by rank before display
    posts.sort(function (post1, post2) {
        if (post1.rank > post2.rank) return -1;
        return post1.rank < post2.rank;
    });

    var list_div = $("#content");
    list_div.empty();
    projectRankObj = {};


    var displayString = "";

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

    activateDeleteHover();

    //set up and handle toggling
    display_project_helper();

};

/**
 * Displays the role types on page given data from ajax call
 * @param data : JSON representation of roletype objects
 */
var display_roletype_list = function (data) {
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

    activateDeleteHover();

};

/**
 * Displays the roles on page given data from ajax call
 * @param data : JSON representation of roles objects
 */
var display_role_list = function (data) {
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

    activateDeleteHover();
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
        $.get("/admin/ajax/project/", display_project_list);
    });

    $("#roles-tab").click(function () {
        $.get("/admin/ajax/roles", display_role_list);
    });

    $("#roletypes-tab").click(function () {
        $.get("/admin/ajax/role_type", display_roletype_list);
    });

    //toggle roles preview for projects and role types
    $('#content').on('click', '.elem', function () {
        if (!isChangingRanks()) {
            if ($(this).children(".roles-quick-view").is(":hidden")) {
                //listing was not expanded
                //hide all previews first
                $(".roles-quick-view").slideUp();
                $(".retract-icon").hide();
                $(".expand-icon").show();

                //show the roles associated with clicked listing
                $(this).children(".roles-quick-view").slideDown();
                $(this).children(".retract-icon").show();
                $(this).children(".expand-icon").hide();

            } else {
                //clicked listing is already expanded,
                // hide the roles associated with clicked listing
                $(this).children(".roles-quick-view").slideUp();
                $(this).children(".expand-icon").show();
                $(this).children(".retract-icon").hide();
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
