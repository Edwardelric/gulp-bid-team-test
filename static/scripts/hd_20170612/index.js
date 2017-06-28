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

    var shareObj = {
        friend: {
            title: "免费DIY服务体验，重庆车主专享！",
            desc: "重庆车主福利来啦，免费洗车，免费后视镜镀膜，免费可视化蒸发箱检测任你选！",
            link: "https://" + url('hostname') + url('path'),
            imgUrl: "https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170616hd/index/share.jpg?v=1"
        },
        friendQuan: {
            title: "免费DIY服务体验，重庆车主专享！",
            link: "https://" + url('hostname') + url('path'),
            imgUrl: "https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170616hd/index/share.jpg?v=1"
        }
    }
    commonObj.initWxShare($,"",shareObj);

    // $.ajax({
    //     type: 'GET',
    //     url: '/cxb/hd/index.shtml',
    //     success: function(data) {
    //         console.log('success1');
    //     }
    // })
});