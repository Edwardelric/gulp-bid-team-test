require(['jquery','bootstrap-sass','datePicker','common'],function($){
    $(function(){
        $('#tel').formatTel();

        if( $('#telCodeTxt').length ){
            $('#telCodeTxt').val('');
        }
        if( $('#payPwdTxt').length ){
            $('#payPwdTxt').val('');
        }

        (function(){
            // 大小写转换
            $('.priceToUpper').priceToLarger( $('#balance').html().replace(/,/g,'') );
            $('#priceToUpperAmount').priceToLarger( $('#amount').html().replace(/,/g,'') );
        })();

        (function(){
            // 点击发送验证码 弹窗
            var imgCode = $('#imgCode'),
                imgCodeClick = $('#imgCodeClick'),
                imgCodeTxt = $('#imgCodeTxt'),
                telCode = $('#telCode');
            telCode.on('click',function(){
                if( $(this).hasClass('disabled') ){
                    return false;
                }
                imgCodeTxt.val('');
                $('#imgcodeModal').modal('show');
            });
            imgCodeClick.on('click',function(){
                imgCode.attr('src','/geneImageCode?'+ (new Date().getTime()) );
            });
        })();

        (function(){
            // 图片验证码 确认验证
            var imgcodeValid = $('#imgcodeValid'),
                tipError = $('#tipError'),
                telCode = $('#telCode');
            imgcodeValid.on('click',function(){
                var val = $('#imgCodeTxt').val();
                if( !val || !/^\w{5}$/.test(val) ){
                    tipError.html('请输入正确的校验码').show();
                }else{
                    tipError.hide();
                    $.ajax({
                        url:'/sendSmsCode',
                        method:'GET',
                        data:{
                            imageCode:$('#imgCodeTxt').val(),
                            payPhone:$('#payPhone').val()
                        },
                        success:function(response){
                            if( response.success ){
                                tipError.hide();
                                $('#imgcodeModal').modal('hide');
                                telCode.addClass('disabled');
                                dealTime();
                            }else{
                                tipError.html(response.error).show();
                            }
                        }
                    });
                }
            });
            // 倒计时
            function dealTime(){
                var maxTime = 120,curTime = 121,timer = null;
                timer = setInterval(function(){
                    curTime--;
                    if(curTime<0){
                        telCode.html('重新发送校验码');
                        telCode.removeClass('disabled');
                        clearInterval(timer);
                    }else{
                        telCode.html(curTime+'s后重新发送');
                    }
                },1000);
            }
        })();

        (function(){
            // 确认付款
            var payBtn = $('#payBtn'),
                telCode = $('#telCodeTxt'),
                payPwd = $('#payPwdTxt');
            var arrError = [$('#telCodeErr'),$('#payPwdErr')];
            payBtn.on('click',function(){
                if( $(this).hasClass('disabled') ){
                    return false;
                }
                var _self = $(this);
                var telVal = telCode.val(),
                    payPwdVal = payPwd.val();
                if( telVal && /^\d{6}$/.test(telVal) ){
                    arrError[0].hide();
                    if( payPwdVal && /^(\d|\w){6,20}$/.test(payPwdVal) ){
                        arrError[1].hide();
                        $(this).addClass('disabled');
                        if( $('#titleFlag').val()=='付款' ){
                            $.ajax({
                                url:'/bondOperate/payDeposit',
                                method:'GET',
                                data:{
                                    tenderId:$('#tenderId').val(),
                                    bidId:$('#bidId').val(),
                                    smscode:$('#telCodeTxt').val(),
                                    password:payPwdVal,
                                    amount:$('#amount').html()
                                },
                                success:function(response){
                                    if(response.success){
                                        window.location.href = '/paySuccess?type=2&depositId='+response.depositId;
                                    }else {
                                        if( response.times >=3 ){
                                            $('#passErrModal').modal('show');
                                        }else{
                                            $('#txtWarning').html(response.errmsg).show();
                                        }
                                    }
                                    _self.removeClass('disabled');
                                }
                            })
                        }else{
                            $.ajax({
                                url:'/bondOperate/ReturnDeposit',
                                method:'GET',
                                data:{
                                    tenderId:$('#tenderId').val(),
                                    bidId:$('#bidId').val(),
                                    depositId:$('#depositId').val(),
                                    smscode:$('#telCodeTxt').val(),
                                    password:payPwdVal,
                                    amount:$('#amount').html()
                                },
                                success:function(response){
                                    if(response.success){
                                        window.location.href = '/paySuccess?type=1&depositId='+response.depositId;
                                    }else {
                                        if( response.times >=3 ){
                                            $('#passErrModal').modal('show');
                                        }else{
                                            $('#txtWarning').html(response.errmsg).show();
                                        }
                                    }
                                    _self.removeClass('disabled');
                                }
                            })
                        }
                    }else{
                        arrError[1].show();
                    }
                }else{
                    arrError[0].show();
                }
            });

        })();
    });
});

