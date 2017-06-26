$(function(){
    console.log(commonObj.isApp());
    $.ajax({
        type: 'GET',
        url: '/cxb/hd/index.shtml',
        success: function(data) {
        }
    })
});