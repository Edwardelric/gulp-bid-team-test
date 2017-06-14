require(['jquery','bootstrap-sass','datePicker','common'],function($){
    $(function(){
        (function(){
            // 公司信息
            var para = $('#introHide p'),
                toggleBtn = $('#toggleBtn');
            if( introHide.length<=3 ){ return false; }
            var otherPara = para.slice(3);
            otherPara.hide();
            toggleBtn.show();
            para.css('opacity',1);
            // 伸缩效果
            var step = 0;
            toggleBtn.click(function(){
                step++;
                otherPara.toggle(function(){
                    if(step%2){
                        toggleBtn.html('【收起详情】');
                    }else{
                        toggleBtn.html('【查看详情】');
                    }
                });
            });
        })();
    })
});