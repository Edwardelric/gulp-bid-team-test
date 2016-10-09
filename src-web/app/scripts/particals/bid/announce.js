require(['jquery','bootstrap-sass','datePicker','common'],function($){
    $(function(){

        (function(){
            // 倒计时
            var deadlineList = $('#tabContent .deadline');
            deadlineList.eq(0).deadLine();
            deadlineList.eq(1).deadLine({time:'2016/08/06'});
        })();

        (function(){
            // 日期设置
            var datePicker = $('#datepicker');
            datePicker.pickadate({format:'yyyy-mm'});
        })();

        (function(){
            // 点击查询搜索
            var btnSearch = $('#btn-search'),
                datePicker = $('#datepicker'),
                searchName = $('#searchName'),
                tabContent = $('#tab-content-0,#tab-content-1,#tab-content-2'),
                noResult = $('#noResult');
            btnSearch.on('click',function(){
                var datePickerVal = datePicker.val(),
                    searchNameVal = searchName.val();
                if( !checkVal(datePickerVal) && !checkVal(searchNameVal) ){
                    return false;
                }else{
                    $.ajax({
                        url:'/showcase/ajaxLoading',
                        method:'GET',
                        success:function(response){
                            tabContent.hide();
                            noResult.show();
                        }
                    });
                }
            });
            function checkVal(val){
                if( !val || /^\s*$/.test(val) ){
                    return false;
                }else{
                    return true;
                }
            }
        })();

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
        })();

    });
});