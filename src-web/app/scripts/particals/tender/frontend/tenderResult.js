require(['jquery','bootstrap-sass','datePicker','common'],function($){
    $(function() {
        (function () {
            // table tr 点击效果
            var tr = $('#tradeInfoTable tr');
            tr.on('click', function () {
                var id = $(this).attr('data-id');
                var companyId= $(this).attr('data-companyid');
                if (id) {
                    window.location.href = '/tender/'+companyId+'/noticeDetail/' + id;
                }
            })
        })();
    });
})