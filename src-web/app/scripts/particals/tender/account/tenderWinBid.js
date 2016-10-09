require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    $(function(){
        // 点击弹窗显示
        var project = $('#modal .modal-body>div');
        project.slice(1).hide();
        $('.toggle-modal').on('click',function(){
            var index = $(this).attr('data-id');
            project.hide().eq(index).show();
            $('#modal').modal('show');
        });
    });
});