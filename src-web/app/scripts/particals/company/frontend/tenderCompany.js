require(['jquery','bootstrap-sass','datePicker','common'],function($){
    $(function(){

        (function(){
            // tab 切换
            var tabList = $('#tabList li'),
                tabContent = $('#tab-content-0,#tab-content-1,#tab-content-2,#tab-content-3');
            tabList.on('click',function(){
                tabList.removeClass('active');
                $(this).addClass('active');
                var index = tabList.index(this);
                tabContent.addClass('display-none');
                tabContent.eq(index).removeClass('display-none');
            });

            var val = null,searchStatus = $('#SearchStatus'),searchForm = $('#searchForm');
            $('#searchExtra').on('click','li',function(){
                searchStatus.val('');
                if( $(this).attr('data-key') ){
                    val = $(this).attr('data-key');
                    searchStatus.val(val);
                }
                searchForm.submit();
            });
        })();

        (function(){
            // 倒计时
            var deadLineList = $('.deadLine');
            deadLineList.each(function(){
                $(this).deadLine({time:$(this).attr('data-deadLine'),showSeconds:false});
            });
        })();
    });
})