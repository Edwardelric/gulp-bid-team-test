require(['jquery','bootstrap-sass','common'],function($) {
    var projectTxt = ["一", "二", "三","四","五","六","七","八","九","十"];
    $(".projectWrap").each(function(i){
        $(this).find(".projectName").text("项目"+projectTxt[i])
        $(this).find(".quoteWrap").each(function(j){
            $(this).find("p").text("报价"+projectTxt[j])
        });
    });
});