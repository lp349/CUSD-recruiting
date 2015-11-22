display_posting_list = function(data){
	    posts = JSON.parse(data);
	    list_div = $("#list_container");

	    list_div.empty();
	    list_div.append('<ul>');

	    for(var i = 0; i < posts.length; i++){
		list_div.append('<li>' + posts[i].name + '</li>');
	    }

	    list_div.append('</ul>');
};

displayRoleList = function(data){
	    roles = JSON.parse(data);
	    list_div = $("#list_container");

	    list_div.empty();
	    list_div.append('<ul>');

	    for(var i = 0; i < roles.length; i++){
		list_div.append('<li>' + roles[i].title + '</li>');
	    }

	    list_div.append('</ul>');
};

$(document).ready(function(){
    $("#project").click(function(){
	$.get("/admin/ajax/project/", display_posting_list);
    });

    $("#role").click(function(){
	$.get("/admin/ajax/roles", display_role_list);
    });

    $("#role_type").click(function(){
	$.get("/admin/ajax/role_type", display_posting_list);
    });

    $("#gg").click(function(){
	$.get("/admin/ajax/project/",  function(data){
	    posts = JSON.parse(data);
	    list_div = $("#list_container");

	    list_div.empty();
	    list_div.append('<ul>');

	    for(var i = 0; i < posts.length; i++){
		list_div.append('<li>' + posts[i].name + '</li>');
	    }

	    list_div.append('</ul>');
	});
    });
});