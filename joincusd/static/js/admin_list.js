$(document).ready(function(){
    $("#gg").click(function(){
	$.get("/admin/ajax/project/", function(posts){
	    if(posts == []){
		alert("lol get rekt mate");
	    }
	    else{
		alert("AYYY MACARENA");
	    }
	});
    });
});