var activeTab = "";

var toggle = function(id) {
            if (id === "projects-tab") {
                $(".add").attr("href", "/admin/add_project/");
            }else if (id === "roletypes-tab") {
                $(".add").attr("href", "/admin/add_role_type/");
            }else if (id === "roles-tab") {
                $(".add").attr("href", "/admin/add_role/");
            }
        };

function generateElem(typ, posting) {
    if (typ === "Project") {
        var p = "<div class='project elem' id='" + posting.id + "'>"
            + "<span class='elem-name'>" + posting.name + "</span>"
            + "<a class='edit button' href='edit_project/" + posting.id +"/'>Edit</a>"
            + "<a class='remove button' href='remove_project/" + posting.id + "/'>Remove</a>"
            + "</div>";
        return p;
    } else if ((typ === "RoleType")) {
        var rt = "<div class='role-type elem' id='" + posting.id + "'>"
            + "<span class='elem-name'>" + posting.name + "</span>"
            + "<a class='edit button' href='edit_role_type/" + posting.id +"/'>Edit</a>"
            + "<a class='remove button' href='remove_role_type/" + posting.id + "/'>Remove</a>"
            + "</div>";
        return rt;
    } else if ((typ === "Opening")) {
        var r = "<div class='role elem' id='" + posting.id + "'>"
            + "<span class='elem-name'>" + posting.title + "</span>"
            + "<a class='edit button' href='edit_role/" + posting.id +"/'>Edit</a>"
            + "<a class='remove button' href='remove_role/" + posting.id + "/'>Remove</a>"
            + "</div>";
        return r;
    }
}

display_project_list = function (data) {
    var posts = JSON.parse(data);
    var list_div = $("#content");
    list_div.empty();

    for (var i = 0; i < posts.length; i++) {
        console.log(posts[i].name);
        list_div.append(generateElem("Project", posts[i]));
    }
};

display_roletype_list = function (data) {
    var posts = JSON.parse(data);
    var list_div = $("#content");
    list_div.empty();

    for (var i = 0; i < posts.length; i++) {
        console.log(posts[i].name);
        list_div.append(generateElem("RoleType", posts[i]));
    }
};

display_role_list = function (data) {
    var posts = JSON.parse(data);
    var list_div = $("#content");
    list_div.empty();

    for (var i = 0; i < posts.length; i++) {
        console.log(posts[i].title);
        list_div.append(generateElem("Opening", posts[i]));
    }
};

$(document).ready(function () {

    //tab click styling
    $('#nav-bar').on('click', '.tab', function () {
        $('.tab').removeClass('selected-tab');
        $(this).addClass('selected-tab');
        activeTab = $(this).attr("id");
        toggle(activeTab);
    });


    //render postings and roles elements
    $("#projects-tab").click(function () {
        console.log("project tab clicked");
        $.get("/admin/ajax/project/", display_project_list);
    });

    $("#roles-tab").click(function () {
        console.log("roles tab clicked");
        $.get("/admin/ajax/roles", display_role_list);
    });

    $("#roletypes-tab").click(function () {
        console.log("role types tab clicked");
        $.get("/admin/ajax/role_type", display_roletype_list);
    });

    //element click styling
    $('#content').on('click', '.elem', function () {
        $('.elem').removeClass('selected-elem');
        $(this).addClass('selected-elem');
    });


    //edit and remove buttons
    $('.remove.button').on('click', function () {
        var parent = $(this).parent();
        var name = $("#" + parent.attr("id") + " span").html();
        var conf = confirm("Are you sure you want to remove " + name + "?");
        if (conf) parent.remove();
    });


    $('.edit.button').on('click', function () {
        var parent = $(this).parent();
        var name = $("#" + parent.attr("id") + " span").html();
        alert(name + ": DoStuffs xD")

    });

    $("#projects-tab").trigger("click");
});
