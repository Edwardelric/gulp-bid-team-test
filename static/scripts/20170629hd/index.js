new Vue({
    el: '#myApp',
    data: {
        showShareFlag: false,           // 是否显示分享
        showBackTopFlag: false,         // 是否显示返回顶部
        showDownloadFlag: false,        // 是否显示底部下载
        promiseDate: null,               // 请求promise
        submitSuccess: false            //  自定义数据（可以删）
    },
    created: function () {
        //只在app中显示分享按钮
        if (commonObj.isApp()) {
            this.showShareFlag = true;
        }
        // create 生命周期下发起异步请求
        this.promiseDate = this.$http.get('/activity/actFreeExp/getCurrentDate.htm');
        this.promiseDataPost =  this.$http.post('/activity/actFreeExp/activityFreeExp.htm', {a: 'b'});
    },
    mounted: function () {
        if (!commonObj.isApp()) {
            var shareObj = {
                friend: {
                    title: "上海斯柯达明锐车主快看过来，一起玩！",
                    desc: "上汽车享家带我们清洗节气门，自己动手免费参与哦！",
                    link: "https://" + url('hostname') + url('path'),
                    imgUrl: "https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170616hd/index/share.jpg?v=1"
                },
                friendQuan: {
                    title: "上海斯柯达明锐车主快看过来，一起玩！",
                    link: "https://" + url('hostname') + url('path'),
                    imgUrl: "https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170616hd/index/share.jpg?v=1"
                }
            }
            commonObj.initWxShare(this,"",shareObj);
        }

        this.bindScroll();
        //打点
        commonObj.ANA_AnalyticsScan();

        // mounted 生命周期下处理resolve
        this.promiseDate.then(function(res) {
            console.log(res);
        }, function(err) {
            $.toast(err);
        });
        this.promiseDataPost.then(function(res) {
            console.log(res);
        }, function(err) {
            $.toast(err);
        });
    },
    methods: {
        share: function () {
            // 分享
            var shareObject = {};
            shareObject.url = "https://" + url('hostname') + url('path');
            shareObject.title = "上海斯柯达明锐车主快看过来，一起玩！";
            shareObject.content = "上汽车享家带我们清洗节气门，自己动手免费参与哦！";
            shareObject.imgUrl =  "https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170616hd/index/share.jpg?v=1";
            lb.shareInfo(shareObject, function(data) {});
        },
        backTop: function () {
            // 返回顶部
            commonObj.scrollToExtend();
            $("body").scrollTo({toT: 0});
        },
        bindScroll: function () {
            // 监听滚动事件
            var _this = this;
            var winHeight = window.innerHeight;
            window.addEventListener("scroll", function () {
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollTop > winHeight) {
                    _this.showBackTopFlag = true;
                }else {
                    _this.showBackTopFlag = false;
                }
            });
        }
    }
});