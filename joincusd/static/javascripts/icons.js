/**
 * Icon Styling
 * @param baseElem
 * @returns {string}
 */


//assume body to contain base html font size as default
//formula partly from http://quayzar.com/wordpress/pixels-to-rem-calculator/
var getRemBase = function(baseElem) {
    var px = ""; //px string, e.g. "12px"
    if (baseElem) {
        px = $(baseElem).css("font-size");
    }
    else {
        px = $("body").css("font-size");
        //if (px === "100%") px="16px";
    }
    return px.substring(0,px.indexOf("px"));
};


/**
 * Converts pixel value to rem
 * @param px
 * @returns {string}
 */
var pixelsToRem = function(px) {
    var remBase = getRemBase();
    var expand = Math.pow(10, 8);
    return "" + ((px*expand)/remBase)/expand + "rem";
};

//y optional
/**
 * Converts pixel values to rem
 * @param x : {number} - first pixel value
 * @param y : {number} - optional second pixel value
 * @returns {string}
 */
var remCalc = function(x, y) {
    var px1 =  pixelsToRem(x);
    var px2 =  "";
    if (y) {
        px2 = " " + pixelsToRem(y);
    }
    return px1 + px2;
};

$(document).ready(function() {
    //default background size
    $.each($(".icon"), function(index, icon) {
        if ($(icon).css("background-size") === "auto") $(icon).css("background-size", "65%");
    });


    /**
     * //EXAMPLE USAGE//
    //temp: hardcode project icon sizes

     //object mapping short names
     //(which can be found on admin home as the "css selector" next to posting titles)
    var roleTypesHomePage = {
        engineering: {
            default: remCalc(157,122)
        },
        design: {
            default:remCalc(123, 123)
        },
        strategy: {
            default: remCalc(151, 114)
        }
        };

    var roleTypesIndividualPage = {
        "engineering": {
            default: remCalc(190)
        },
        "design": {
            default: remCalc(1200)
        },
        "strategy": {
            default: remCalc(180)
        }
    };

    var projects = {
        "engineering": {
            default: remCalc(190)
        },
        "design": {
            default: remCalc(1200)
        },
        "strategy": {
            default: remCalc(180)
        },

        seg: {
            default: remCalc(180)
        },
        ord: {
            default: remCalc(210)
        },
        gbmp: {
            default: remCalc(180)
        },
        ct: {
            default: remCalc(200)
        },
        cap:  {
            default: remCalc(180)
        },
        cf: {
            default: remCalc(180)
        }
    };

    var seg  = remCalc(180);
    var segMed = remCalc(155);
    var segLar = remCalc(175);

    var ord = remCalc(210);

    var gbmp = remCalc(180);

    var ct = remCalc(200);

    var cap = remCalc(180);

    var cf = remCalc(180);

    //home page
    $.each(Object.keys(roleTypesHomePage), function(index, rt) {
        console.log(".icon--role-" + rt);
        $(".icon--role-" + rt).css("background-size", roleTypesHomePage[rt].default);
    });

    //$.each(Object.keys(roleTypesIndividualPage), function(index, rt) {
    //    console.log(".icon--project-" + rt);
    //    $(".icon--project-" + rt).css("background-size", roleTypesIndividualPage[rt].default);
    //});

    $.each(Object.keys(projects), function(index, proj) {
        $(".icon--project-" + proj).css("background-size", projects[proj].default);
    });


    //roletype page
    **/


});