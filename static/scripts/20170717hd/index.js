new Vue({
    el: '#myApp',
    mixins: [commonObj.commonMixin()],   // mixins 公用方法
    data: {
        basicInfo: {
            showShareFlag: commonObj.isAppVersionMinor_4(),                              // 是否显示分享
            showBackTopFlag: false,                            // 是否显示返回顶部
            showDownloadFlag: !commonObj.isApp(),             // 是否显示底部下载
            showDownloadTpl: '',                               // 吸底tips的中间文案模板
            linkTpl: ''  // 下载文案和跳转路径
        },
        shareTxt: {
            friend: {
                title: '拼人气，赢iPhone！车享家人气挑战全境开赛，快来呼朋唤友！',
                desc: '邀请好友来车享家消费，赢取iPhone6s、iPad mini4、免费保养，戳我参加吧！',
                link: 'https://' + url('hostname') + url('path'),
                imgUrl: 'https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170717hd/index/share.png?v=1'
            },
            friendQuan: {
                title: '拼人气，赢iPhone！车享家人气挑战全境开赛，快来呼朋唤友！',
                desc: '邀请好友来车享家消费，赢取iPhone6s、iPad mini4、免费保养，戳我参加吧！',
                link: 'https://' + url('hostname') + url('path'),
                imgUrl: 'https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170717hd/index/share.png?v=1'
            }
        },
        inviteUrl: '/cx/cxj/cxjweb/invitefriends2/invitefriends2.shtml'
    },
    created: function () {
        /*--------------created周期里保存异步请求promise----------------*/
        // this.promiseDate = this.$http.get('/activity/actFreeExp/getCurrentDate.htm');
        /*--------------created周期里保存异步请求promise----------------*/
    },
    mounted: function () {
        (function(_this){
            if (!commonObj.isApp()) {                                               // 判断设备类型
                _this.wxShareFn();
            } else {
                _this.share();
            }
            commonObj.ANA_AnalyticsScan();
            _this.bindScroll(_this);
        })(this);
        /*-----------------开始开发业务逻辑代码-----------------------*/
        /*-----------------开始开发业务逻辑代码-----------------------*/
    },
    methods: {}
});