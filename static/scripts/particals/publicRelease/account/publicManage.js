require(['jquery','bootstrap-sass','common','datePicker'],function($){
    (function () {
        // 时间
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
            startDatePicker.set('max',new Date(endSeconds-singleDay));
            endDatePicker.set('min',new Date(startSeconds+singleDay));
            endDatePicker.set('max',new Date(searchEndVal));
        }else if( searchStartVal && !searchEndVal ){
            // 无结束时间
            startSeconds = new Date(searchStartVal).getTime();
            startDatePicker.set('min',new Date(searchStartVal));
            endDatePicker.set('min',new Date(startSeconds+singleDay));
        }else if( !searchStartVal && searchEndVal ){
            // 无开始时间
            endSeconds = new Date(searchEndVal).getTime();
            startDatePicker.set('max',new Date(endSeconds-singleDay));
        }

        startDate.on('change',function(){
            var seconds = new Date($(this).val()).getTime()+singleDay;
            endDate.val('');
            if( $(this).val() ){
                endDatePicker.set('min',new Date(seconds));
            }else{
                startDatePicker.set('min',false);
                startDatePicker.set('max',false);
                endDatePicker.set('min',false);
                endDatePicker.set('max',false);
            }
        });
        endDate.on('change',function(){
            var seconds = new Date($(this).val()).getTime()-singleDay;
            if( $(this).val() ){
                if( startDate.val() ){
                    startDatePicker.set('min',new Date(startDate.val()));
                }
                startDatePicker.set('max',new Date(seconds));
            }else{
                startDatePicker.set('max',false);
                endDatePicker.set('max',false);
            }
        });
    })();
    // 删除
    $(".delBtn").on("click",function(){
    var dataId=$(this).attr("data-id");
       $(".modal_1").modal("show");
        $("#modalInfo_1").text("您确定删除该条公示?");
        $("#md_ok_1").attr('data-id',dataId)
    });

    $("#md_ok_1").off("click").on("click",function(){
        var dataid=$(this).attr("data-id");
        $.ajax({
            url:'/account/deleteNotice/'+dataid,
            type:'POST',
            success: function(){
                location.href=location.href;
            }
        });
    });
});