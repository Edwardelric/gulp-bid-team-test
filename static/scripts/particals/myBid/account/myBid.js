require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    $(function () {
        (function () {
            // 时间
            var startDate = $('#startDate'),
                endDate = $('#endDate');
            var startDatePicker = startDate.pickadate().pickadate('picker'),
                endDatePicker = endDate.pickadate().pickadate('picker');
            var singleDay = 86400000;
            startDate.on('change',function(){
                var seconds = new Date($(this).val()).getTime()+singleDay;
                if( !checkTime($(this).val(),endDate.val()) ){
                    endDate.val('');
                }
                endDatePicker.set('min',new Date(seconds));
            });
            endDate.on('change',function(){
                var seconds = new Date($(this).val()).getTime()-singleDay;
                startDatePicker.set('max',new Date(seconds));
            });
            function checkTime(startDate,endDate){
                if(!endDate){
                    return true;
                }else{
                    if( new Date(startDate).getTime() < new Date(endDate).getTime() ){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        })();

        (function(){
            var btnSearch = $('#btnSearch'),
                startDate = $('#startDate'),
                endDate = $('#endDate'),
                number = $('#number'),
                name = $('#name');
            btnSearch.on('click',function(){
                var startDateVal = startDate.val(),
                    endDateVal = endDate.val();
                if( !checkVal(startDateVal) && !checkVal(endDateVal) &&
                    !checkVal(number.val()) && !checkVal(name.val()) ){
                    return false;
                }else{
                    $.ajax({
                        url:'/showcase/ajaxLoading',
                        method:'GET',
                        success:function(response){
                            tabContent.hide();
                            noResult.show();
                            paymentPosition.removeClass('paymentPosition');
                        }
                    })
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
    })
});