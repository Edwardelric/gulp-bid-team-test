require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    $(function(){
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
            $(".payBtn").on("click",function(){
                var fundingAccount=$(this).attr("funding-account"),
                    payMoney=$(this).attr("pay-money");

                $.ajax({
                    url:'/validateCashAccount',
                    type:'GET',
                    success : function(data){
                        if(data=="NoCashAccount"){
                            $(".modal_binding").modal("show");
                            $("#goBinding").click(function(){
                                window.open(fundingAccount)
                            })
                        } else if(data=="CashAccountLocked"){
                            $(".modal_2").modal("show");
                            $("#modalInfo_2").text("您的资金账户已冻结，请联系技术人员");
                            $("#md_ok_2").on("click",function(){$(".modal_2").modal("hide")})
                        } else if(data=="success"){
                            location.href=payMoney
                        } else{
                            return false;
                        }
                    }
                });
            });
        })();

        (function(){
            $(".cancelBtn").on("click",function(){
                var tenderId=$(this).attr("data-bidid");
                $(".modal_1").modal("show");
                $("#modalInfo_1").text("您确定删除该条项目？");
                $("#md_ok_1").attr("data-tenderId",tenderId);
                return false;
            });
            $("#md_ok_1").off("click").on("click",function(){
                var removeId= $("#md_ok_1").attr("data-tenderId");
                $.ajax({
                    url:'/account/deleteBid/'+removeId,
                    type:'GET',
                    success:function(response){
                        if(response=="success"){
                            window.location.reload();
                        }
                    }
                });
            });
        })()
    })
});