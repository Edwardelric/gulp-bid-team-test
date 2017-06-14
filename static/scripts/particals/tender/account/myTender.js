require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    $(function () {
        (function(){
            $('.deadLine').each(function(){
                $(this).deadLine({time:$(this).attr('data-deadLine')});
            });
        })();

        (function(){
            var val = null,searchStatus = $('#SearchStatus'),searchForm = $('#searchForm');
            $('#searchExtra').on('click','a',function(){
                searchStatus.val('');
                if( $(this).attr('data-key') ){
                    val = $(this).attr('data-key');
                    searchStatus.val(val);
                }
                searchForm.submit();
            });
        })();

        (function(){
            $(".cancelBtn").on("click",function(){
                var tenderId=$(this).attr("data-tenderId");
                $(".modal_1").modal("show");
                $("#modalInfo_1").text("您确定删除该条项目？");
                $("#md_ok_1").attr("data-tenderId",tenderId);
                return false;
            });
            $("#md_ok_1").off("click").on("click",function(){
                var removeId= $("#md_ok_1").attr("data-tenderId");
                $.ajax({
                   url:'/account/deleteTender/'+removeId,
                   type:'GET',
                   success:function(response){
                       if(response=="success"){
                           window.location.reload();
                       }
                   }
                });
            });
        })()
    });
});