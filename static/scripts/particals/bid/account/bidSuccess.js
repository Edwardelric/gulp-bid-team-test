require(['jquery','bootstrap-sass','datePicker','common'],function($) {

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
                        location.href='/account/myBid';
                        window.open(fundingAccount);
                    })
                } else if(data=="CashAccountLocked"){
                    $(".modal_2").modal("show");
                    $("#modalInfo_2").text("您的资金账户已冻结，请联系技术人员");
                    $("#md_ok_2").on("click",function(){$(".modal_2").modal("hide")})
                } else if(data=="success"){
                    location.href=payMoney;
                } else{
                    return false;
                }

            }
        });
    });
});