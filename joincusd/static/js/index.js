/**
 * This file contains the scripts for list.html
 */


/******************************************* Globals *********************************************/

//the active tab (i.e. projects-tab, roletypes-tab...)
var activeTab = "";

//maps project ids to the original and new rankings
//format = {[PROJECT ID/PK]:{originalRank: [ORIGINAL RANK], newRank: [NEW RANK]}, ...}
var projectRankObj = {};


/******************************************* Handy Toggling Methods *********************************************/


/**
 * Description: Hides the roles preview for all listings
 */
var hideAllQuickView = function () {
    $(".roles-quick-view").slideUp();
    $(".retract-icon-wrapper").hide();
    $(".expand-icon-wrapper").show();
};

/**
 * Description: Shows the roles preview for exactly one listing
 * @param listingElem {string} the listing element whose preview to show
 */
var showQuickView = function (listingElem) {
    hideAllQuickView();
    //show the roles associated with clicked listing
    $(listingElem).children(".roles-quick-view").slideDown();
    $(listingElem).children(".retract-icon-wrapper").show();
    $(listingElem).children(".expand-icon-wrapper").hide();
};

/**
 * Description: Toggles the role preview, given the listing element
 * @param elem : {string} the listing element (generally has a class ".elem")
 */
var toggleRolesPreview = function (elem) {
    if ($(elem).children(".roles-quick-view").is(":hidden")) {
        //show the roles associated with clicked listing
        showQuickView(elem);
    } else {
        //clicked listing is already expanded,
        // hide the roles associated with clicked listing
        hideAllQuickView();
    }
};


/**
 * Description: shows only the edit button
 */
var activateRankButtonsRankDisabled = function () {
    $(".rank-button").hide();
    $(".edit-rank-button").show();
};

/**
 * Description: Prepares buttons and icons for rank changing
 */
var activateRankButtonsRankEnabled = function () {
    //prepare for rank changing:
    //show the other rank buttons
    $(".rank-button").show();
    $(".edit-rank-button").hide();

    //show the "move" or drag icon
    $(".drag-icon").show();
    //hide any open previews
    hideAllQuickView();

    //hide the buttons and expand icon
    $(".elem-button").hide();
    $(".expand-icon-wrapper").hide();
};

/**
 * Description: Hides all rank buttons
 */
var deactivateAllRankButtons = function () {
    $(".rank-button").hide();
};


/*
 See: http://stackoverflow.com/questions/19333098/403-forbidden-error-when-making-an-ajax-post-request-in-django-framework
 */
/**
 * Description: Gets a cookie
 * @param name
 * @returns {*}
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


/******************************************* All Other Methods *********************************************/

/**
 * Description: Generates html for common elements (buttons, spans)
 * and appends the generated html to a container (if provided)
 *
 * Methods Provided:
 *      button(opts): Creates a button as an "<a>" element,
 *                          takes in an opts object that may contain:
 *
 *              confirmationMessage : should be of form " onclick = .... "
 *              classes : the class names to give to the button
 *              href : the link (if any)
 *              clickFunction : the function for the click event
 *              container : the parent container for the button
 *              hide : whether to hide the button
 *
 *     span(opts): Creates a span element,
 *                          takes in an opts object that may contain:
 *
 *              classes : the class names to give to the span
 *              container : the parent container for the span
 *              hide : whether to hide the span
 *
 *      rolesList(opts): Creates a role preview
 *                          takes in an opts object that may contain:
 *
 *              roles: the array of role names
 *              classes : the class names to give to each individual role
 *              container : the parent container for the roles
 *              hide : whether to hide the roles (the parent container)
 *              emptyText: text to display if there are no roles
 *
 * @type {{button: Function, span: Function, rolesList: Function}}
 */
var generate = {
    button: function (opts) {
        var button = (opts.confirmationMessage) ? $('<a' + opts.confirmationMessage + '>') : $('<a>');

        button.addClass(opts.classes)
            .attr("href", opts.href)
            .html(opts.html)
            .click(opts.clickFunction);

        if (opts.container) button.appendTo(opts.container);
        if (opts.hide) button.hide();
        return button;
    },
    span: function (opts) {
        var span = $("<span>")
            .addClass(opts.classes)
            .html(opts.html);

        if (opts.container) span.appendTo(opts.container);

        if (opts.hide) span.hide();
        return span;
    },
    rolesList: function (opts) {
        var rolesList = $(opts.container);
        for (var i = 0; i < opts.roles.length; i++) {
            $("<li>").addClass(opts.classes).html(opts.roles[i]).appendTo(rolesList);
        }
        var noRolesText = opts.emptyText ? opts.emptyText : "There are no roles under this category.";

        if (opts.roles.length === 0)
            $("<li>").addClass(opts.classes).html(noRolesText).appendTo(rolesList);

        if (opts.hide) rolesList.hide();
        return rolesList;
    }
};


/**
 * Description: Deals with lower level displaying of the three posting types.
 *              More specifically, it contains all methods that involve adding
 *              a single listing to the page, and is called by the methods in the
 *              display object
 *
 * Methods provided:
 *      projectListing(container, posting)
 *      roleTypeListing(container, posting)
 *      roleListing(container, posting)
 *
 *      where container is the html element to append the listing to
 *      and posting is the data of the listing/posting
 * @type {{}}
 */
var append = {};


/**
 * Description: Appends a single listing to the container
 * @param container : {string} a valid selector
 * @param posting : {object} the data for the posting
 */
append.projectListing = function (container, posting) {
    var publishedStr = "Unpublish";
    if (!posting.published) publishedStr = "Publish";

    var commonButtonClasses = " elem-button admin-button ";

    var elem = $("<li>")
        .addClass('project elem ui-state-default')
        .addClass('elem-published-' + posting.published)
        .click(function () {
            if ($(".ui-sortable-disabled").length > 0) toggleRolesPreview(this);
        })
        .attr("id", posting.id)
        .appendTo(container);

    var dragIcon = $(Icons.drag).appendTo(elem).hide();

    var removeButton = generate.button({
        confirmationMessage: " onclick=\"return confirm('Are you sure you want to delete this project?')\" ",
        html: Icons.remove,
        container: elem,
        href: 'remove_project/' + posting.id + '/',
        classes: commonButtonClasses + "remove-button"
    });
    var postingName = generate.span({
        classes: "elem-name",
        html: posting.name,
        container: elem
    });
    var postingShortName = generate.span({
        classes: "elem-short-name",
        html: "(css selector: " + posting.short_name + ")",
        container: elem
    });

    var buttonsWrapper = $("<section>").addClass("elem-button-wrapper").appendTo(elem);

    var publishButton = generate.button({
        classes: commonButtonClasses + "published-" + posting.published + " publish-button",
        clickFunction: function () {
            $.get("ajax/toggle_publish/project/" + posting.id + "/", function () {
                ajax.fetchAndDisplay.projects();
            })
        },
        html: publishedStr,
        container: buttonsWrapper
    });
    var editButton = generate.button({
        classes: commonButtonClasses + 'edit-button',
        href: 'edit_project/' + posting.id + '/',
        html: "Edit",
        container: buttonsWrapper
    });
    var rolesList = generate.rolesList({
        container: $("<ul>").addClass('roles-quick-view'),
        hide: true,
        classes: "roles-quick-view-elem",
        emptyText: "There are no roles under this project.",
        roles: posting.roles
    }).appendTo(elem);

    var expandIcon = $("<div>").addClass("expand-icon-wrapper").append($(Icons.expand)).appendTo(elem);
    var retractIcon = $("<div>").addClass("retract-icon-wrapper").append($(Icons.retract)).appendTo(elem).hide();
};


/**
 * Description: Sets up click events for rank buttons
 * @param sortableContainer
 */
var activateRankings = function (sortableContainer) {
    var editRankButton = $(".edit-rank-button").click(function () {
        //enable sorting (rank changing) and set cursor
        $(sortableContainer).sortable("enable");
        $(sortableContainer).children("li").css("cursor", "move");

        activateRankButtonsRankEnabled();

    });
    var saveRankButton = $(".save-rank-button").click(function () {
        //update the rankings and reload the page
        ajax.updateRanks.projects();
        activateRankButtonsRankDisabled();
    });
    var cancelRankButton = $(".cancel-rank-button").click(function () {
        //just reload the page
        ajax.fetchAndDisplay.projects();
        activateRankButtonsRankDisabled();
    });

    activateRankButtonsRankDisabled();
};


/**
 * Description: Appends rank buttons to the container,
 * but does not set up click events
 *
 * @param mainContainer : {string} a valid selector
 */
var appendRankButtons = function (mainContainer) {
    var buttonContainer = $("<div>").addClass("rank-buttons-section").prependTo(mainContainer);
    var commonClasses = ' rank-button admin-button ';
    var editRankButton = generate.button({
        classes: (commonClasses + 'edit-rank-button'),
        html: ("Edit Rank"),
        container: (buttonContainer),
        hide: true
    });
    var saveRankButton = generate.button({
        classes: (commonClasses + 'save-rank-button'),
        html: ("Save"),
        container: (buttonContainer),
        hide: true
    });
    var cancelRankButton = generate.button({
        classes: (commonClasses + 'cancel-rank-button'),
        html: ("Cancel"),
        container: (buttonContainer),
        hide: true
    })
};

/**
 * Appends a single listing to the container
 * @param container : {string} a valid selector
 * @param posting : {object} the data for the posting
 */
append.roleTypeListing = function (container, posting) {
    var publishedStr = "Unpublish";
    if (!posting.published) publishedStr = "Publish";

    var commonButtonClasses = " elem-button admin-button ";

    var elem = $("<div>")
        .addClass('role-type elem')
        .addClass('elem-published-' + posting.published)
        .click(function () {
            toggleRolesPreview(this);
        })
        .attr("id", posting.id)
        .appendTo(container);

    var removeButton = generate.button({
        confirmationMessage: " onclick=\"return confirm('Are you sure you want to delete this discipline?')\" ",
        classes: commonButtonClasses + "remove-button",
        href: 'remove_role_type/' + posting.id + '/',
        html: (Icons.remove),
        container: (elem)
    });

    var postingName = generate.span({
        classes: ("elem-name"),
        html: (posting.name),
        container: (elem)
    });

    var postingShortName = generate.span({
        classes: ("elem-short-name"),
        html: ("(css selector: " + posting.short_name + ")"),
        container: (elem)
    });

    var buttonsWrapper = $("<section>").addClass("elem-button-wrapper").appendTo(elem);

    var publishButton = generate.button({
        classes: (commonButtonClasses + "published-" + posting.published + " publish-button"),
        clickFunction: function () {
            ajax.togglePublish.roleTypes(posting.id);
        },
        html: (publishedStr),
        container: (buttonsWrapper)
    });

    var editButton = generate.button({
        classes: (commonButtonClasses + 'edit-button'),
        href: ('edit_role_type/' + posting.id + '/'),
        html: ("Edit"),
        container: (buttonsWrapper)
    });

    var rolesList = generate.rolesList({
        container: $("<ul>").addClass('roles-quick-view'),
        hide: true,
        classes: 'roles-quick-view-elem',
        roles: posting.roles,
        emptyText: "There are no roles under this discipline."
    }).appendTo(elem);

    var expandIcon = $("<div>").addClass("expand-icon-wrapper").append($(Icons.expand)).appendTo(elem);
    var retractIcon = $("<div>").addClass("retract-icon-wrapper").append($(Icons.retract)).appendTo(elem).hide();
};


/**
 * Description: Appends a single listing to the container
 * @param container : {string} a valid selector
 * @param posting : {object} the data for the posting
 */
append.roleListing = function (container, posting) {
    var elem = $("<div>").addClass("role elem").attr("id", posting.id).appendTo(container);
    var removeConfirmation = " onclick=\"return confirm('Are you sure you want to delete this role?')\" ";
    var commonButtonClasses = " elem-button admin-button ";
    var removeButton = generate.button({
        confirmationMessage: removeConfirmation,
        classes: (commonButtonClasses + "remove-button"),
        href: ('remove_role/' + posting.id + '/'),
        html: (Icons.remove),
        container: (elem)
    });

    var postingName = generate.span({
        classes: ("elem-name"),
        html: (posting.title),
        container: (elem)
    });
    var editButton = generate.button({
        classes: (commonButtonClasses + 'edit-button'),
        href: ('edit_role/' + posting.id + '/'),
        html: ("Edit"),
        container: (elem)
    });
}

/**
 * Description: Deals with higher level rendering/loading of the three posting types
 *
 * Methods provided:
 *      projects(data) : display projects given data
 *      roleTypes(data) : role types given data
 *      roles(data) :  display roles given data
 *      getRanksAsArray(): returns the new ranks for the projects
 * @type {{_container: string, _sortableContainerId: string, _posts: null, _generalSort: Function, _reverseSort: Function, _init: Function, projects: Function, roleTypes: Function, roles: Function, getRanksAsArray: Function}}
 */
var display = {
    _container: "#content",
    _sortableContainerId: "sortable",
    _posts: null,
    /**
     * Description: Smallest-first sort for array of objects
     * @param posts : Array -the array of objects to sort
     * @param commonKey : String -objects sorted by this key
     * @returns {*|Array.<T>}
     * @private
     */
    _generalSort: function (posts, commonKey) {
        return posts.sort(function (post1, post2) {
            if (post1[commonKey] < post2[commonKey]) return -1;
            return post1[commonKey] > post2[commonKey];
        });
    },
    /**
     * Description: Largest-first sort for array of objects
     * @param posts : Array -the array of objects to sort
     * @param commonKey : String -objects sorted by this key
     * @returns {*|Array.<T>}
     * @private
     */
    _reverseSort: function (posts, commonKey) {
        return posts.sort(function (post1, post2) {
            if (post1[commonKey] > post2[commonKey]) return -1;
            return post1[commonKey] < post2[commonKey];
        });
    },
    /**
     * Description: Common code to all three rendering methods,
     * i.e. parsing the JSON data from ajax call
     * and clearing the display area to add elements
     * @param data : JSON data from jquery ajax call
     * @returns {string} : the container
     * @private
     */
    _init: function (data) {
        this._posts = JSON.parse(data);
        var $this = this;
        $($this._container).empty();
        deactivateAllRankButtons();
        return $this._container;
    },
    /**
     * 1. Sorts the given projects by rank
     * 2. Populates projectRankObj with ids and original rankings
     * 3. Adds project listings as sortable "li" elements
     * 4. Calls a helper method to toggle the sortable list
     * @param data : JSON representation of projects with relevant project info,
     *              retrieved from ajax call
     */
    projects: function (data) {
        var $this = display; //because "this" refers to the object returned by jquery ajax
        var list_div = $this._init(data);
        appendRankButtons($this._container);

        //sort postings by rank
        var posts = $this._reverseSort($this._posts, "rank");

        //create and append the sortable ul (for jquery-ui sortable)
        var sortable = $("<ul>").attr("id", $this._sortableContainerId)
            .appendTo(list_div);

        //keep track of project-rank mappings for changes in rankings
        projectRankObj = {};

        //add the project listings
        for (var i = 0; i < posts.length; i++) {
            append.projectListing(sortable, posts[i]);

            //populate projectRankObject with pks (project ids) and original ranks
            projectRankObj[posts[i].id] = {};
            projectRankObj[posts[i].id]["originalRank"] = i;
            projectRankObj[posts[i].id]["newRank"] = i;
        }

        //enable sortable (code must be here, because otherwise,
        // ajax calls will result in jumping to the top of the page)
        sortable.sortable()
            .disableSelection()
            .sortable("disable");

        //prepend the rank buttons
        //appendRankButtons(list_div, sortable);
        activateRankings("#" + $this._sortableContainerId);

        return $this;
    },
    /**
     * Description: Displays the role types on page given data from ajax call
     * @param data : JSON representation of roletype objects
     */
    roleTypes: function (data) {
        var $this = display;
        var list_div = $this._init(data);

        //regular lexical sort
        var posts = $this._generalSort($this._posts, "name");

        for (var i = 0; i < posts.length; i++) {
            append.roleTypeListing(list_div, posts[i]);
        }
        return this;
    },

    /**
     * Description: Displays the roles on page given data from ajax call
     * @param data : JSON representation of roles objects
     */
    roles: function (data) {
        var $this = display;
        var list_div = $this._init(data);

        //regular lexical sort
        var posts = $this._generalSort($this._posts, "title");
        for (var i = 0; i < posts.length; i++) {
            append.roleListing(list_div, posts[i]);
        }
        return this;
    },
    /**
     * Description: Returns the current rankings, in order, as an array.
     * @returns {*|jQuery}
     */
    getRanksAsArray: function () {
        var $this = this;
        return $("#" + $this._sortableContainerId).sortable("toArray");
    }
};


/**
 * Description: Deals with ajax calls
 * @type {{fetchAndDisplay: {projects: Function, roleTypes: Function, roles: Function}, togglePublish: {projects: Function, roleTypes: Function}, updateRanks: {_populateProjectRanks: Function, _getNewRanks: Function, projects: Function}}}
 */
var ajax = {
    /**
     * Description: Makes an ajax call to get data for the postings,
     * and calls the relevent display method to display the postings
     */
    fetchAndDisplay: {
        projects: function () {
            $.get("/admin/ajax/project/", display.projects);
        },
        roleTypes: function () {
            $.get("/admin/ajax/role_type", display.roleTypes);
        },
        roles: function () {
            $.get("/admin/ajax/roles", display.roles);
        }
    },
    /**
     * Description: Makes an ajax call to toggle the publishing of projects and role types
     */
    togglePublish: {
        projects: function (projectId) {
            $.get("ajax/toggle_publish/project/" + projectId + "/", ajax.fetchAndDisplay.projects);
        },
        roleTypes: function (roleTypeId) {
            $.get("ajax/toggle_publish/role_type/" + roleTypeId + "/", ajax.fetchAndDisplay.roleTypes);
        }
    },
    /**
     * Description: Gets the new rankings for projects,
     *              Finds the changes in rankings,
     *              Makes an ajax call to update db with new rankings,
     *              Finally, re-displays with new project rankings
     */
    updateRanks: {
        /** Description: If these requirements below are satisfied, then the method will
         *              fetch the current ranks of the projects on the page and populate
         *              the new display ranks of the projectRankObj.
         * This method requires that:
         * 1. project listings have unique integer ids
         * 2. projects tab is active (projects are being displayed and not roles or role types
         */
        _populateProjectRanks: function () {
            //get order of ids
            var idOrder = display.getRanksAsArray();
            $.each(idOrder, function (index, id) {
                var prevNewRank = projectRankObj[id]["newRank"];
                if (index !== prevNewRank) {
                    projectRankObj[id]["newRank"] = index;
                }
            });
        },
        /**
         * Description: Returns an array of objects of the following format:
         * {id: [projectId], rank: [newRank]}
         * where new_rank is a DB rank (higher rank = greater priority)
         * that correspond to objects with rank changes
         */
        _getNewRanks: function () {
            /**
             * @param displayRank : project rank on page (lower "rank" = higher priority)
             * @param numProjects : number of projects
             * @return number: DB rank (higher the rank, the greater the priority)
             */
            var convertToDBRank = function (displayRank, numProjects) {
                return numProjects - displayRank;
            };

            //get the new ranks
            this._populateProjectRanks();

            var changes = [];
            //iterate through all projects to find changes
            $.each(Object.keys(projectRankObj), function (index, projectId) {
                var newRank = projectRankObj[projectId]["newRank"];
                var originalRank = projectRankObj[projectId]["originalRank"];
                if (newRank !== originalRank) {
                    changes.push({
                        projectId: projectId,
                        newRank: convertToDBRank(newRank, Object.keys(projectRankObj).length)
                    });
                }
            });
            return changes;
        },
        projects: function () {
            var $this = this;
            var rank_changes = JSON.stringify($this._getNewRanks());
            var csrftoken = getCookie('csrftoken');
            $.post("/admin/ajax/update_ranks", {
                csrfmiddlewaretoken: csrftoken,
                rank_string: rank_changes
            }, function () {
                ajax.fetchAndDisplay.projects();
            });
        }
    }
};


/**
 * Description; Deals with all logic involving the navigation bar
 *
 * Methods provided:
 *      init() : you must call this to initialize the admin home page,
 *              as it sets up the tab events
 *
 * @type {{_projectsTab: string, _rolesTab: string, _roleTypesTab: string, _selector: string, _tabSelector: string, _addButtonSelector: string, _activeTab: string, init: Function}}
 */
var navigation = {
    _projectsTab: "#projects-tab",
    _rolesTab: "#roles-tab",
    _roleTypesTab: "#roletypes-tab",
    _selector: "#nav-bar",
    _tabSelector: ".tab",
    _addButtonSelector: '.add',
    _activeTab: "#projects-tab", //default selected tab
    init: function () {
        var $this = this;

        //set up click events for tabs and save links to respective add forms
        $($this._projectsTab)
            .data("addLink", "/admin/add_project/")
            .click(function () {
                ajax.fetchAndDisplay.projects();
            });

        $($this._rolesTab)
            .data("addLink", "/admin/add_role/")
            .click(function () {
                ajax.fetchAndDisplay.roles();
            });

        $($this._roleTypesTab)
            .data("addLink", "/admin/add_role_type/").click(function () {
                ajax.fetchAndDisplay.roleTypes();
            });

        //handle general tab styling and recording of tab
        $($this._selector).on('click', $this._tabSelector, function () {

            //tab click styling
            $($this._tabSelector).removeClass('selected-tab');
            $(this).addClass('selected-tab');

            //save activetab ->
            // this tab will be active the next time this page is accessed
            activeTab = "#" + $(this).attr("id");
            //createCookie("active",activeTab, 1);
            sessionStorage["active"] = activeTab;

            //set add button link
            $($this._addButtonSelector).attr("href", $(this).data("addLink"));

        });

        //now that tabs events are set,
        // go to last active tab (the tab that was last accessed, if any)
        var prevActiveTab = sessionStorage["active"];
        if (prevActiveTab) {
            $this._activeTab = prevActiveTab;
        }

        $($this._activeTab).trigger("click");
    }
};

$(document).ready(function () {
    navigation.init();
});
