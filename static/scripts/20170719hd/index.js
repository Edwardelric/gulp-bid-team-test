new Vue({
    el: '#myApp',
    mixins: [commonObj.commonMixin()],   // mixins 公用方法
    data: {
        basicInfo: {
            showShareFlag: commonObj.isAppVersionMinor_4(),                              // 是否显示分享
            showBackTopFlag: false                            // 是否显示返回顶部
        },
        shareTxt: {
            friend: {
                title: '车享家携手中石油送福利啦，购昆仑机油送价值百元三重好礼！',
                desc: '即日起-8月31日，至中石油站点购昆仑机油，享车享家免费换油、免费赠送滤芯、免费20项安全检测服务',
                link: 'https://' + url('hostname') + url('path'),
                imgUrl: 'https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170719hd/index/share.png'
            },
            friendQuan: {
                title: '车享家携手中石油送福利啦，购昆仑机油送价值百元三重好礼！',
                desc: '即日起-8月31日，至中石油站点购昆仑机油，享车享家免费换油、免费赠送滤芯、免费20项安全检测服务',
                link: 'https://' + url('hostname') + url('path'),
                imgUrl: 'https://s1.cximg.com/cms/wap/resource/chexiangjiaM/active/notice/20170719hd/index/share.png'
            }
        }
    },
    created: function () {

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
    }
});