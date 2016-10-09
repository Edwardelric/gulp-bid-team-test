define(['jquery','bootstrap-sass','datePicker'],function(){
    $(function () {
        (function(){
            //  导航条hover 显示影藏效果
            var hoverLi = [
                $('#hoverLi'), $('#phoneHelpLi')
            ];
            var showDiv = [
                $('#hoverShowDiv'), $('#phoneHelpDiv')
            ];
            $.each(hoverLi, function (index, item) {
                var _self = $(this);
                (function (index, _self) {
                    item.hover(function () {
                        showDiv[index].show();
                        _self.addClass('active');
                    }, function () {
                        showDiv[index].hide();
                        _self.removeClass('active');
                    });
                })(index, _self);
            });
        })();

        (function(){
            // 判断是否吸底
            function checkHandler() {
                var winHeight = $(window).height(),
                    navigationHeight = $('#navigation').height(),
                    subNavHeight = $('#subNav').height(),
                    mainHeight = $('#main').height(),
                    sidebar = $('#sidebar').height(),
                    footerHeight = $('#paymentFooter').height();
                var footer = $('#paymentFooter');
                mainHeight = sidebar>mainHeight?sidebar:mainHeight;
                var total = navigationHeight + subNavHeight + mainHeight + footerHeight + 32;
                if (total > winHeight) {
                    footer.removeClass('paymentFooter');
                } else {
                    footer.addClass('paymentFooter');
                }
            }
            checkHandler();
            $(window).on('resize', function () {
                checkHandler();
            });
        })();

        function bgError(btnHref,popTxt){
            $('#modal-server-error403').modal('show');
            $('#server-error-msg2').text(popTxt);
            $('#confirmJump').off('click').on('click',function(){
                location.href=btnHref;
            });
        }

        (function(){
            // ajax 请求设置
            $.ajaxSetup({
                global: true,
                // dataType: "json",
                beforeSend: function (jqXHR, settings) {
                    jqXHR.$setting = settings;
                },
                error: function (jqXHR, textStatus, exception) {
                    var XHRstatus = jqXHR.status;
                    var errorStatus = [400, 403, 404, 500];
                    if (XHRstatus == 401) {

                    } else if (XHRstatus == 409) {
                        var message = JSON.parse(jqXHR.responseText).error;
                        showServerError(XHRstatus, message);
                    } else if (XHRstatus == 403) {
                        if(jqXHR.responseJSON.error=='improve'){
                            bgError(jqXHR.responseJSON.url,'公司信息待完善');
                        }else if(jqXHR.responseJSON.error=='verifying'){
                            bgError(jqXHR.responseJSON.url,'公司信息待审核');
                        }else if(jqXHR.responseJSON.error=='verifyNotPass'){
                            bgError(jqXHR.responseJSON.url,'公司信息审核未通过');
                        }

                    }
                    else if ($.inArray(XHRstatus, errorStatus) >= 0) {
                        showServerError(XHRstatus, '');
                    }
                }
            });
            var showServerError = function (status, message) {
                var errorMsg = {
                    401: '请重新登录...',
                    403: message || '您没有权限访问该网页...',
                    404: '您访问的网页不存在...',
                    400: '参数传入错误，请稍后重试...',
                    500: '服务器出错，请稍后重试...',
                    409: message || '服务器正忙，请稍后重试!'
                };
                $('#server-error-msg').text(errorMsg[status]);
                $('#modal-server-error').modal('show');
            };
        })();

        (function(){
            // 全局 loading 效果
            var loading = $('#loading'),
                mask = $('#mask');
            $(document).ajaxStart(function () {
                mask.show();
                loading.show();
            });
            $(document).ajaxStop(function() {
                var timer = null;
                timer = setTimeout(function () {
                    mask.hide();
                    loading.hide();
                    clearTimeout(timer);
                }, 600);
            });
        })();

        (function(){
            // 倒计时功能
            $.fn.deadLine = function (options) {
                var defaults = {
                    time: '2017/08/04 00:00:00'
                };
                var options = options ? options : defaults;
                this.timer = null;
                var _self = this;
                if( $('#serverDataTime').length == 0 ){
                    throw new Error('id:serverDataTime can not find');
                }
                var curTime = null;
                var curTimeTmp = null;
                this.calTime = function () {
                    if( !curTimeTmp ){
                        curTimeTmp = new Date(options.time).getTime();
                    }else{
                        curTimeTmp = curTimeTmp-1000;
                    }
                    curTime = (curTimeTmp - (new Date( $('#serverDataTime').val() ).getTime()) ) / 1000;
                    var str = '';
                    if ( curTime > 0) {
                        var second = Math.floor(curTime % 60);
                        var minute = Math.floor((curTime / 60) % 60);
                        var hour = Math.floor((curTime / 3600) % 24);
                        var day = Math.floor((curTime / 3600) / 24);
                        if( !options.showSeconds ){
                            str = formatTime(day) + '天' + formatTime(hour) + '时' + formatTime(minute) + '分';
                        }else{
                            str = formatTime(day) + '天' + formatTime(hour) + '时' + formatTime(minute) + '分' + formatTime(second) + '秒';
                        }
                        _self.html(str);
                    } else {
                        if( !options.showSeconds){
                            _self.html('<span class="text-warning">00</span> 天 <span class="text-warning">00</span> 时 <span class="text-warning">00</span> 分');
                        }else{
                            _self.html('<span class="text-warning">00</span> 天 <span class="text-warning">00</span> 时 <span class="text-warning">00</span> 分 <span class="text-warning">00</span> 秒');
                        }
                        _self.hide();
                        clearInterval(_self.timer);
                    }
                };
                this.timer = setInterval(_self.calTime, 1000);
                function formatTime(time) {
                    if (time < 10) {
                        return '<span class="text-warning">0' + time + '</span>';
                    } else {
                        return '<span class="text-warning">' + time + '</span>';
                    }
                }
            };
        })();

        (function(){
            // 全局去除 表单 自动提示功能
            $('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
            $('[data-toggle=tooltip]').each(function(){
                if( $(this).html() ){
                    $(this).tooltip();
                }
            });
        })();

        (function(){
            // 手机号码中间添加*号
            $.fn.formatTel = function(){
                var val = null;
                if( !this.length ){ return this }
                if( this[0].tagName.toLowerCase() =='input'){
                    val = this.val();
                    if( val && !/^\s*$/.test(val) ){
                        this.val( val.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2') );
                    }
                }else{
                    val = this.html();
                    if( val && !/^\s*$/.test(val) ){
                        this.html( val.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2') );
                    }
                }
            };
            $.fn.priceToLarger = function(val){
                // 金钱转大写
                this.html( switchTxt( val ) );
                function switchTxt(n) {
                    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
                        return '数据非法';
                    if(n==0){
                        return  '零元整' ;
                    }
                    var unit = "千百拾亿千百拾万千百拾元角分", str = "";
                    n += "00";
                    var p = n.indexOf('.');
                    if (p >= 0)
                        n = n.substring(0, p) + n.substr(p+1, 2);
                    unit = unit.substr(unit.length - n.length);
                    for (var i=0; i < n.length; i++){
                        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
                    }
                    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
                }
            }
        })();

        (function(){
            // 分页跳转到第几页input校验
            var pTxt = $('#J_ym-pagination-input');
            if( !pTxt.length ){
                return false;
            }
            var oldVal = null;
            pTxt.on('keydown',function(){
                oldVal = $(this).val();
            });
            pTxt.on('keyup',function(event){
                var keyCode = event.keyCode;
                if( keyCode == 190 ){
                    $(this).val( oldVal );
                }
                if( (keyCode<48 || keyCode>57) && keyCode != 8 ){
                    $(this).val('1');
                }
                if( keyCode == 13 ){
                    $(this).val( $(this).val().replace(/[^\d]/g,'') );
                }
            });
            pTxt.on('paste',function(){
                return false;
            });
        })();

        (function(){
            // 搜索条件
            if( !$('#searchForm').length ){ return false;}
            // 搜索时间
            function timeInitHandler(){
                var startDate = $('#createStartDate'),
                    endDate = $('#createEndDate');
                var startDatePicker = startDate.pickadate().pickadate('picker'),
                    endDatePicker = endDate.pickadate().pickadate('picker');
                var singleDay = 86400000;

                var searchStartVal = startDate.val(),
                    searchEndVal = endDate.val();
                var startSeconds = null,endSeconds = null;
                if( searchStartVal && searchEndVal ){
                    // 开始时间和结束时间都有
                    startSeconds = new Date(searchStartVal).getTime();
                    endSeconds = new Date(searchEndVal).getTime();
                    startDatePicker.set('min',new Date(searchStartVal));
                    endDatePicker.set('min',new Date(startSeconds+singleDay));
                }else if( searchStartVal && !searchEndVal ){
                    // 无结束时间
                    startSeconds = new Date(searchStartVal).getTime();
                    endDatePicker.set('min',new Date(startSeconds+singleDay));
                }else if( !searchStartVal && searchEndVal ){
                    // 无开始时间
                    endSeconds = new Date(searchEndVal).getTime();
                }
                startDate.on('change',function(){
                    var seconds = new Date($(this).val()).getTime()+singleDay;
                    endDate.val('');
                    if( $(this).val() ){
                        endDatePicker.set('min',new Date(seconds));
                    }else{
                        endDatePicker.set('min',false);
                        endDatePicker.set('max',false);
                    }
                });
            }
            if( $('#createStartDate').length>0 ){
                // 是否需要初始化时间
                timeInitHandler();
            }
            String.prototype.trim = function(){
                return this.replace(/(^\s*)|(\s*$)/g,'');
            };
            // 提交trim清除
            $('#searchForm').submit(function(){
                var tenderTitle = $('#tenderTitle');
                var tenderCode = $('#tenderCode');
                var tplName = $('#tplName');
                if( tenderTitle.length>0 ){
                    tenderTitle.val( (tenderTitle.val()).trim() );
                }
                if( tenderCode.length>0 ){
                    tenderCode.val( (tenderCode.val()).trim() );
                }
                if( tplName.length>0 ){
                    tplName.val( (tplName.val()).trim());
                }
            });
        })();
    });
});
