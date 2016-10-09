require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    $(function(){
        (function () {
            $(".delBtn").on("click",function(){
                var tenderId=$(this).attr("data-tenderId");
                $(".modal_1").modal("show");
                $("#modalInfo_1").text("您确定删除该条项目？");
                $("#md_ok_1").attr("data-tenderId",tenderId);
            });
            $("#md_ok_1").off("click").on("click",function(){
                var removeId= $("#md_ok_1").attr("data-tenderId");
                $.ajax({
                    url:'/account/deleteTender/'+removeId,
                    type:'GET',
                    success:function(data){
                        if(data=="success"){
                            window.location.reload();
                        }
                    }
                });
            });
        })();
    });
});