$(function(){
    $.ajaxSettings.beforeSend = function(xhr, request) {
        console.log(request);
    }
    $.ajaxSettings.error = function(xhr, errorType, error) {
        console.log(errorType, error);
    }
    $.ajaxSettings.complete = function(xhr, status) {
        console.log('status',status)
        $.toast('1231');
    }
    $.ajaxSettings.success = function(data, status, xhr) {
        console.log('success2');
    }
    $.ajax({
        type: 'GET',
        url: '/cxb/hd/index.shtml',
        success: function(data) {
            console.log('success1');
        }
    })
});