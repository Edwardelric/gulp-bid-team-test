require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    $(function(){
        (function(){
            var deadLine = $('.deadLine');
            deadLine.each(function(){
                $(this).deadLine({time:$(this).attr('data-deadLine')});
            })
        })();
    })
})