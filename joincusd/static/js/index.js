/**
 * This file contains the scripts for list.html
 */

//the active tab (i.e. projects-tab, roletypes-tab...)
var activeTab = "";

//maps project ids to the original and new rankings
//format = {[PROJECT ID/PK]:{originalRank: [ORIGINAL RANK], newRank: [NEW RANK]}, ...}
var projectRankObj = {};

/**
 * Hides the roles preview for all listings
 */
var hideAllQuickView = function () {
    $(".roles-quick-view").slideUp();
    $(".retract-icon").hide();
    $(".expand-icon").show();
};

/**
 * Shows the roles preview for exactly one listing
 * @param listingElem -the listing element whose preview to show
 */
var showQuickView = function (listingElem) {
    hideAllQuickView();
    //show the roles associated with clicked listing
    $(listingElem).children(".roles-quick-view").slideDown();
    $(listingElem).children(".retract-icon").show();
    $(listingElem).children(".expand-icon").hide();
};

/**
 *
 * @param elem
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
 * Generate html for common elements (buttons, spans)
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

function appendProjectListing(container, posting) {
    var publishedStr = "Unpublish";
    if (!posting.published) publishedStr = "Publish";
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
        classes: "elem-button remove-button button"
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
        classes: "elem-button published-" + posting.published + " publish-button button",
        clickFunction: function () {
            $.get("ajax/toggle_publish/project/" + posting.id + "/", function () {
                ajax.fetchAndDisplay.projects();
            })
        },
        html: publishedStr,
        container: buttonsWrapper
    });
    var editButton = generate.button({
        classes: 'elem-button edit-button button',
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

    var expandIcon = $(Icons.expand).appendTo(elem);
    var retractIcon = $(Icons.retract).appendTo(elem).hide();
}

var appendRankButtons = function (mainContainer, sortableContainer) {
    var buttonContainer = $("<div>").addClass("rank-buttons-section").prependTo(mainContainer);
    var editRankButton = generate.button({
        classes: ('rank edit-rank'),
        html: ("Edit Rank"),
        clickFunction: (function () {
            //prepare for rank changing:
            //show the other rank buttons
            $(".rank").show();
            $(this).hide();
            //enable sorting (rank changing) and set cursor
            $(sortableContainer).sortable("enable");
            $(sortableContainer).children("li").css("cursor", "move");

            //show the "move" or drag icon
            $(".drag-icon").show();
            //hide any open previews
            hideAllQuickView();

            //hide the buttons and expand icon
            $(".elem-button").hide();
            $(".expand-icon").hide();

        }),
        container: (buttonContainer)
    });
    var saveRankButton = generate.button({
        classes: ('rank save-rank'),
        html: ("Save"),
        clickFunction: (function () {
            //update the rankings and reload the page
            ajax.updateRanks.projects();
        }),
        container: (buttonContainer),
        hide: true
    });
    var cancelRankButton = generate.button({
        classes: ('rank cancel-rank'),
        html: ("Cancel"),
        clickFunction: (function () {
            //just reload the page
            ajax.fetchAndDisplay.projects();
        }),
        container: (buttonContainer),
        hide: true
    })
};

function appendRoleTypeListing(container, posting) {
    var publishedStr = "Unpublish";
    if (!posting.published) publishedStr = "Publish";

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
        classes: "elem-button remove-button button",
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
        classes: ("elem-button published-" + posting.published + " publish-button button"),
        clickFunction: function () {
            ajax.togglePublish.roleTypes(posting.id);
        },
        html: (publishedStr),
        container: (buttonsWrapper)
    });

    var editButton = generate.button({
        classes: ('elem-button edit-button button'),
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

    $(Icons.expand).appendTo(elem);
    $(Icons.retract).appendTo(elem).hide();
}

function appendRoleListing(container, posting) {
    var elem = $("<div>").addClass("role elem").attr("id", posting.id).appendTo(container);
    var removeConfirmation = " onclick=\"return confirm('Are you sure you want to delete this role?')\" ";
    var removeButton = generate.button({
        confirmationMessage: removeConfirmation,
        classes: ("elem-button remove-button button"),
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
        classes: ('elem-button edit-button button'),
        href: ('edit_role/' + posting.id + '/'),
        html: ("Edit"),
        container: (elem)
    });
}

/**
 * Description: Methods dealing with rendering/loading of the three posting types
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

        //sort postings by rank
        var posts = $this._reverseSort($this._posts, "rank");

        //create and append the sortable ul (for jquery-ui sortable)
        var sortable = $("<ul>").attr("id", $this._sortableContainerId)
            .appendTo(list_div);

        //keep track of project-rank mappings for changes in rankings
        projectRankObj = {};

        //add the project listings
        for (var i = 0; i < posts.length; i++) {
            appendProjectListing(sortable, posts[i]);

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
        appendRankButtons(list_div, sortable);

        return $this;
    },
    /**
     * Displays the role types on page given data from ajax call
     * @param data : JSON representation of roletype objects
     */
    roleTypes: function (data) {
        var $this = display;
        var list_div = $this._init(data);
        //regular lexical sort
        var posts = $this._generalSort($this._posts, "name");

        for (var i = 0; i < posts.length; i++) {
            appendRoleTypeListing(list_div, posts[i]);
        }
        return this;
    },

    /**
     * Displays the roles on page given data from ajax call
     * @param data : JSON representation of roles objects
     */
    roles: function (data) {
        var $this = display;
        var list_div = $this._init(data);
        //regular lexical sort
        var posts = $this._generalSort($this._posts, "title");
        for (var i = 0; i < posts.length; i++) {
            appendRoleListing(list_div, posts[i]);
        }
        return this;
    },
    /**
     * Returns the current rankings, in order, as an array.
     * @returns {*|jQuery}
     */
    getRanksAsArray: function () {
        var $this = this;
        return $("#" + $this._sortableContainerId).sortable("toArray");
    }
};

/**
 * Description: Methods dealing with ajax calls
 * @type {{fetchAndDisplay: {projects: Function, roleTypes: Function, roles: Function}, togglePublish: {projects: Function, roleTypes: Function}, updateRanks: {_populateProjectRanks: Function, _getNewRanks: Function, projects: Function}}}
 */
var ajax = {
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
    togglePublish: {
        projects: function (projectId) {
            $.get("ajax/toggle_publish/project/" + projectId + "/", ajax.fetchAndDisplay.projects);
        },
        roleTypes: function (roleTypeId) {
            $.get("ajax/toggle_publish/role_type/" + roleTypeId + "/", ajax.fetchAndDisplay.roleTypes);
        }
    },
    updateRanks: {
        /**
         * This method requires that:
         * 1. project listings have unique integer ids
         * 2. projects tab is active (projects are being displayed and not roles or role types
         * If these requirements are satisfied, then the method will
         * fetch the current ranks of the projects on the page and populate
         * the new display ranks of the projectRankObj.
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
         * Returns an array of objects of the following format:
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

var navigation = {
    _projectsTab: "#projects-tab",
    _rolesTab: "#roles-tab",
    _roleTypesTab: "#roletypes-tab",
    _selector: "#nav-bar",
    _tabSelector: ".tab",
    _addButtonSelector: '.add',
    _activeTab: this._projectsTab, //default selected tab
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
            sessionStorage['active'] = activeTab;

            //set add button link
            $($this._addButtonSelector).attr("href", $(this).data("addLink"));

        });

        //now that tabs events are set,
        // go to last active tab (the tab that was last accessed, if any)
        if (sessionStorage['active']) {
            $this._activeTab = sessionStorage['active']
        }
        ;
        $($this._activeTab).trigger("click");


    }
};

$(document).ready(function () {
    navigation.init();
});
