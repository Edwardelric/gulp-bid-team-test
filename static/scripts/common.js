var commonObj = {
    ANA_AnalyticsScan:function(){
        //埋点
        //重新扫描整个页面
        (new Analytics).scan();//打点CA绑定数据
    },
    isApp:function(){
        var ua = window.navigator.userAgent;//获取ua
        if(ua.indexOf("MongoToC")>=0){
            return true;
        }else{
            return false;
        }
    },
    getChannel:function(){
        var userAgent = window.navigator.userAgent,endType;
        if(userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){//判断是否是微信
            endType = 'wxCode';
        }else if(userAgent.indexOf('MongoToC') > 0){//判断是否来自APP
            endType = 'appCode';
        }else{//来自H5
            endType = 'h5Code';
        }
        return endType;
    },
    isAppVersionMinor_4: function(){
        try{
            var ua = JSON.parse(window.navigator.userAgent),
                appVersion = ua.appVersion;
            console.log(ua);
            if(appVersion){
                var ava = appVersion.replace(".","");
                if(ava>=40){
                    return false;
                }else return true;
            }else return true;
        }catch(e){
            console.log('ua未获取到');
        }
    },
    initWxShare:function(e, wxdomain, shareObj){
        var dateParam = window.location.href;
        var _this = this;
        if (dateParam.indexOf("sit") > 0) {
            wxdomain = "//wx.chexiangsit.com";
        }else if  (dateParam.indexOf("pre") > 0) {
            wxdomain = "//wx.chexiangpre.com";
        }else {
            wxdomain = "//wx.chexiang.com";
        }
        var initSignUrl = wxdomain + '/wxoauth2/s/getShareArgs.htm?url='+dateParam;
        e.$http.jsonp(initSignUrl).then(function(d){
            var data = d.data;
            wx.config({
                debug: false, // 开启调试模式
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'hideOptionMenu',
                    'onMenuShareAppMessage'
                ]
            });

            wx.ready(function () {
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title : shareObj.friend.title, // 分享标题
                    desc : shareObj.friend.desc, // 分享描述
                    link : shareObj.friend.link, // 分享链接
                    imgUrl : shareObj.friend.imgUrl, // 分享图标
                    type : '', // 分享类型,music、video或link，不填默认为link
                    dataUrl : '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger : function (res) {

                    },
                    success : function () {

                    },
                    cancel : function () {
                        // 用户取消分享后执行的回调函数
                        $.toast("取消分享");
                    },
                    fail : function (res) {
                        $.toast("取消失败");

                    }
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title : shareObj.friendQuan.title, // 分享标题
                    link : shareObj.friendQuan.link, // 分享链接
                    imgUrl : shareObj.friendQuan.imgUrl, // 分享图标
                    trigger : function (res) {
                        console.log("trigger");
                    },
                    success : function () {

                    },
                    cancel : function () {
                        // 用户取消分享后执行的回调函数
                        $.toast("取消分享");
                    },
                    fail : function (res) {
                        $.toast("分享失败");
                    }
                });
            });

            wx.error(function (type, res) {

            });

            //防止首页不能进行分享
            function onBridgeReady() {
                wx.showOptionMenu();
            }
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
            wx.showMenuItems({
                menuList : ['menuItem:share:appMessage', 'menuItem:share:timeline']
            });
        });
    },
    scrollToExtend: function() {
        $.fn.scrollTo = function (options) {
            var defaults = {
                toT: 0,    //滚动目标位置
                durTime: 500,  //过渡动画时间
                delay: 30,     //定时器时间
                callback: null   //回调函数
            };
            var opts = $.extend(defaults, options),
                timer = null,
                _this = this,
                curTop = _this.scrollTop(),
                subTop = opts.toT - curTop,
                index = 0,
                dur = Math.round(opts.durTime / opts.delay),
                smoothScroll = function (t) {
                    index++;
                    var per = Math.round(subTop / dur);
                    if (index >= dur) {
                        _this.scrollTop(t);
                        window.clearInterval(timer);
                        if (opts.callback && typeof opts.callback == 'function') {
                            opts.callback();
                        }
                        return;
                    } else {
                        _this.scrollTop(curTop + index * per);
                    }
                };
            timer = window.setInterval(function () {
                smoothScroll(opts.toT);
            }, opts.delay);
            return _this;
        };
    },
    commonMixin: function(){
        // 判断下载页面url跳转路径
        if (/sit/.test(window.location.host)) {
            $('#hrefHost').attr('href','https://cxb.chexiangsit.com/service/version/getLatestAppVersion/0?channel=cxjtyg');
        } else if(/pre/.test(window.location.host) ) {
            $('#hrefHost').attr('href','https://cxb.chexiangpre.com/service/version/getLatestAppVersion/0?channel=cxjtyg');
        } else {
            $('#hrefHost').attr('href','https://cxb.chexiang.com/service/version/getLatestAppVersion/0?channel=cxjtyg');
        }
        var mixin = {
            methods: {
                wxShareFn: function() {
                    // 微信分享
                    commonObj.initWxShare(this,'',this.shareTxt);
                },
                share: function () {
                    // app分享
                    var friend = this.shareTxt.friend;
                    var friendQuan = this.shareTxt.friendQuan;
                    if (commonObj.isAppVersionMinor_4()) {
                        // 小于 4
                        lb.shareInfo({
                            title: friend.desc,
                            url: friend.link,
                            content: friend.title,
                            imgUrl: friend.imgUrl
                        }, function() {});
                    } else {
                        friend = {
                            url: friend.link,
                            title: friend.title,
                            content: friend.desc,
                            imgUrl : friend.imgUrl
                        };
                        friendQuan = {
                            url: friendQuan.link,
                            title: friendQuan.title,
                            content: friendQuan.desc,
                            imgUrl : friendQuan.imgUrl
                        };
                        lb.showMenu();
                        lb.menuShareMsg({
                            wx: friend,
                            wxtl: friendQuan
                        })
                    }
                },
                backTop: function () {
                    // 返回顶部
                    commonObj.scrollToExtend();
                    $('body').scrollTo({toT: 0});
                },
                bindScroll: function (_self) {
                    // 监听滚动事件
                    var _this = this;
                    var winHeight = window.innerHeight;
                    window.addEventListener('scroll', function () {
                        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                        if (scrollTop > winHeight) {
                            _self.basicInfo.showBackTopFlag = true;
                        }else {
                            _self.basicInfo.showBackTopFlag = false;
                        }
                    });
                }
            }
        };
        return mixin;
    }
};