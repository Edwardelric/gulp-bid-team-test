require(['jquery','bootstrap-sass','datePicker','common'],function($){
    $(function() {
        (function () {
            // 倒计时效果
            var deadLine = $('#deadLine'),
                bottomDeadLine = $('#bottomDeadLine');
            deadLine.deadLine({time:deadLine.attr('data-deadLine'),showSeconds:false});
            bottomDeadLine.deadLine({time:deadLine.attr('data-deadLine'),showSeconds:false});
        })();

        (function () {
            // 点击吸底关闭
            var btnClose = $('#btnClose'),
                supplyInfo = $('#supplyInfo'),
                tenderAnnounce = $('#tenderAnnounce'),
                fixBottom = $('#fixBottom');
            btnClose.on('click', function () {
                fixBottom.hide();
                $(window).off();
            });
            // 是否显示采购编号
            var supplyInfoTop = tenderAnnounce.position().top+tenderAnnounce.height()/2+10;
            $(window).on('scroll',function(){
                if( $(window).scrollTop() > supplyInfoTop ){
                    fixBottom.show();
                }else{
                    fixBottom.hide();
                }
            });
        })();

        (function(){
            var download = $('#download'),
                bidBtn = $('#bidBtn'),
                bottomBtn = $('#bottomBtn');
            var priceStart = $('#priceStart'),
                priceEnd = $('#priceEnd');
            var startTime = formatTime( priceStart.html() ),
                endTime = formatTime( priceEnd.html() ),
                curTime = formatTime( bidBtn.attr('data-time').replace(/T/g,' ') );
            if( curTime <= startTime || curTime >= endTime ){
                bidBtn.addClass('disabled');
                bottomBtn.addClass('disabled');
            }else{
                bidBtn.removeClass('disabled');
                bottomBtn.removeClass('disabled');
                $('.deadline:first').show();
            }
            bidBtn.on('click',function(){
                if( $(this).hasClass() ){
                    return false;
                }
            });
            $('#bottomBtn').on('click',function(){
                if( $(this).hasClass('disabled') ){
                    return false;
                }
            });
            function formatTime(val){
                if( !val ){
                    return 0;
                }
                var arr = val.split(' ');
                var d = arr[0].split('-');
                var t = arr[1].split(':');
                var date = new Date();
                date.setUTCFullYear(d[0], d[1] - 1, d[2]);
                date.setUTCHours(t[0], t[1], t[2], 0);
                return date.getTime();
            }
        })();
    });
})