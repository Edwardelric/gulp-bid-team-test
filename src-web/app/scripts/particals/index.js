require(['jquery','bootstrap-sass','datePicker','common'],function($){
    $(function(){
        (function(){
            // 轮播图效果
            var galleryUl = $('#galleryUl'),
                galleryLi = $('#galleryUl li'),
                dot = $('#dot'),
                preBtn = $('#preBtn'),
                nextBtn = $('#nextBtn');
            var len = galleryLi.length;
            if( len <=1 ){
                preBtn.hide();
                nextBtn.hide();
                return false;
            }
            var str = '',runIndex = 0,timer = null,spaceTime = 3000;
            var imgSrc = '';
            for( var i=0;i<len;i++ ){
                if( i==0 ){
                    str += '<span class="active"></span>';
                }else{
                    str += '<span></span>';
                }
                imgSrc = galleryLi.eq(i).find('img').attr('src');
                galleryLi.eq(i).css('background-image','url('+imgSrc+')');
            }
            dot.html('').html(str);
            galleryLi.slice(1).fadeOut();
            function run(index){
                galleryLi.stop(false,true).fadeOut().eq(index).fadeIn();
                dot.find('span').removeClass('active').eq(index).addClass('active');
            }
            timer = setInterval(beforeRun,spaceTime);
            function beforeRun(){
                if( runIndex>=len-1 ){
                    runIndex = 0;
                }else{
                    runIndex++;
                }
                run(runIndex);
            }
            galleryUl.hover(function(){
                clearInterval(timer);
            },function(){
                clearInterval(timer);
                timer = setInterval(beforeRun,spaceTime);
            });
            preBtn.on('click',function(){
                clearInterval(timer);
                runIndex++;
                if( runIndex >= len ){
                    runIndex = 0;
                }
                run(runIndex);
                return false;
            }).on('mouseout',function(){
                clearInterval(timer);
                timer = setInterval(beforeRun,spaceTime);
            });
            nextBtn.on('click',function(){
                clearInterval(timer);
                runIndex--;
                if(runIndex <0 ){
                    runIndex = len-1;
                }
                run(runIndex);
                return false;
            }).on('mouseout',function(){
                clearInterval(timer);
                timer = setInterval(beforeRun,spaceTime);
            });
            dot.find('span').on('click',function(){
                clearInterval(timer);
                var index = dot.find('span').index(this);
                runIndex = index;
                run(runIndex);
            }).on('mouseout',function(){
                clearInterval(timer);
                timer = setInterval(beforeRun,spaceTime);
            });
        })();

        (function(){
            // 倒计时
            var deadLineList = $('.deadLine');
            deadLineList.each(function(){
                $(this).deadLine({time:$(this).attr('data-deadLine'),showSeconds:false});
            });
            // deadlineList.eq(0).deadLine();
            // deadlineList.eq(1).deadLine({time:'2016/08/06'});
        })();

        (function(){
            // 日期设置
            var datepicker = $('#datepicker');
            //datePicker.pickadate({format:'yyyy-mm'});
            datepicker.on('focus',function(){
                WdatePicker({firstDayOfWeek:0,dateFmt:'yyyy-MM',position:{top:4}});
            });
        })();
    });
});