require(['jquery','bootstrap-sass','common'],function($){


    //点击返回按钮

    $("#returnBtn").on("click",function(){
        var prevHref=document.referrer;
        if(prevHref.indexOf("myTenderNotice")>-1){
            location.href = "/account/myTenderNotice";
        }else{
            location.href = "/account/releaseTenderNotice";
        }
    });

});