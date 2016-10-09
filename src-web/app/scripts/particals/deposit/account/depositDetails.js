require(['jquery','bootstrap-sass','common'],function($){
    //保证金 详情页
    $(function(){


        // Hover状态信息
        var $bondState = $('#bondState'),
            $statePop = $('.state-pop');


        $bondState.hover(function() {
            $statePop.show();
        }, function() {
            $statePop.hide();
        });

        $statePop.hover(function() {
            $statePop.show();
        }, function() {
            $statePop.hide();
        });




        // 发送手机验证码_原
        sendValidateCode($('#btnSendPayPhone'), '/sendOldPhoneVerifyCode', '', 'thTask');


        // 初始化 弹框
        $('.returnConfirm').click(function() {
            $('#confirmForm')[0].reset();
            clearInterval(tasks.thTask);           // 清空倒计时
            $('.btnVerifyCode').val('获取验证码').removeClass('expire');

            $('#bid').val(this.getAttribute('data-bid'));
        });


        // 提交 退还保证金
        $('#btnReturnBond').click(function() {

            var $confirmForm = $('#confirmForm'),
                $payCheckCode = $confirmForm.find('[name=payCheckCode]'),
                $payPass = $confirmForm.find('[name=payPass]'),
                $bid = $confirmForm.find('[name=bid]'),

                $errVerifyCode = $('.err-verifyCode'),          //错误提示
                $errPayPass = $('.err-payPass'),
                checkResult = true,
                param = {};              //请求参数

            if(!$.trim($payCheckCode.val())) {
                $errVerifyCode.text('请输入 验证码!').show();
                checkResult = false;
            } else {
                $errVerifyCode.text('').hide();
            }
            if(!$.trim($payPass.val())) {
                $errPayPass.text('请输入 支付密码!').show();
                checkResult = false;
            } else {
                $errPayPass.text('').hide();
            }


            if(checkResult) {
                param.checkCode = $payCheckCode.val();
                param.payPass = $payPass.val();
                param.bid = $bid.val();
            } else {
                return false;
            }

            $.ajax({
                url: '/showcase/ajaxLoading',
                data: param,
                method:'GET',
                success:function(data){
                    //请求成功后 ...
                    alert('请求成功!');
                }
            })
        });


    });
});



var tasks = {
    'thTask' : 0        //退还确认 计时器
};

/**
 * 公用 获取手机验证码
 * @param $btn 发送按钮
 * @param apiUrl
 * @param param  请求参数
 * @param timedTask  计时器
 * @param call
 */
function sendValidateCode($btn, apiUrl, param, timedTask, call) {
    var dataParam = '';

    $btn.click(function() {
        var totalTime = 120;

        if($btn.hasClass('expire')) {
            return false;
        }
        if(param != '') {
            var regPhone = /^(13|14|15|16|17|18)[0-9]{9}$/;
            if( !regPhone.test(param.val()) ) {
                //$.systemMessage({type: 'error', title: '错误：', detail: '请输入有效的手机号!'});
                return false;
            }
            dataParam = {'phone' : param.val()};
        }

        $btn.addClass('expire');

        tasks[timedTask] = setInterval(function() {
            $btn.val('倒计时'+totalTime + '秒');
            totalTime -= 1;

            if(totalTime < 0) {
                clearInterval(tasks[timedTask]);
                $btn.removeClass('expire').val('获取验证码');
            }
        }, 1000);

        // 发送请求......
        $.ajax({
            url: apiUrl,
            method: 'GET',
            data: dataParam,
            success:function(data){
                call && typeof call === 'function' && call(data);
            }
        });
    });
}
