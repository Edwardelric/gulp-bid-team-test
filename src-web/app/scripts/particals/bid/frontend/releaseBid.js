require(['jquery',"simpleAjaxUpload",'uploadify','bootstrap-sass','datePicker','common','select2','jquery-validation'],function($,ss,uploadify) {
    $(function(){
        var bidFileStr=$("#bidFileStr").text();
        if(bidFileStr.length){
            var uploadData = jQuery.parseJSON(bidFileStr);

        }else{
            var uploadData=[]
        }


    var quote={
        "init" : function(){
            this.trimVal();
            this.addQuote();
            this.del();
            this.pickdate();
            this.pageLoad();
            this.quoteTxt();
            this.selectBasic();
            this.uploadFile();
            this.validate();
            this.timeLeft();
            this.select2();
            this.submit();

        },
        "pageLoad" : function(){
            var projectTxt = ["一", "二", "三","四","五","六","七","八","九","十"];
            $(".projectNum").each(function(){
                var num=$(this).data("num")*1-1;
                $(this).text(projectTxt[num])
            });
            //报价序号
            $(".projectInner").each(function(){
                $(this).find(".addQuoteName").each(function(i){
                    $(this).text("报价"+projectTxt[i]);
                });
            });
        },
        "trimVal" : function(){
            $(document).on("blur","input",function(){
                var trimVal=$.trim($(this).val());
                $(this).val(trimVal)
            });
        },
        "quoteTxt" : function(){
            $(".projectInfoContent").each(function(){
                var quoteLen=$(this).find(".addQuoteWrap").length;
                var arr = ["一", "二", "三","四","五","六","七","八","九","十"];
                if(quoteLen>=1){
                    $(this).find(".addQuoteWrap").last().find(".addQuoteName").text("报价"+arr[quoteLen-1])
                }
            })
        },
        "del" : function(){
            $(document).on("click",".delIcon",function(){
                    delWrap=$(this).parents(".addQuoteWrap");
                    delBigWrap=$(this).parents(".addQuote");
                    lastLen=$(this).parents(".addQuote").find(".addQuoteWrap").length;
                    delIndex=$(this).parents(".projectInner").index();
                    thatL=$(this);
                $(".modal_1").modal("show");
                $("#modalInfo_1").text("您确定删除该条报价");

            });
            $("#md_ok_1").off("click").on("click",function(){
                var arr = ["一", "二", "三","四","五","六","七","八","九","十"];
                //判断是否为最后一条数据
                if(lastLen==1){
                    delBigWrap.remove()
                }else{
                    delWrap.remove();
                }
                $(".modal_1").modal("hide");
                //报价标题变化

                $(".projectInner").eq(delIndex).find(".addQuoteWrap").each(function(i,e){
                    $(this).find(".addQuoteName").text("报价"+arr[i])
                });

            });
        },
        "timeLeft" : function(){
            //$(".projectTitRight").each(function(){
            //    var timeInfo=$(this).siblings(".projectTitLeft").find('.timeInfo').text();
            //    $(this).find(".timeLeft").deadLine(timeInfo);
            //});
        },
        "select2" : function(){

            $(".projectInfoContent").find(".addQuote").find("select").each(function(){
                $(this).select2({
                      minimumResultsForSearch: Infinity
                });
            })

        },
        "pickdate" : function(){
            $(".startDate").pickadate();
            $(".endDate").pickadate();
            var day_1 = 86400000;
            //开始时间大于今天限制
            $(".startDate").each(function(){
                $(this).pickadate("picker").set("disable", [
                    { from: [1970,1,1], to: new Date($.now()-day_1)}
                ]);
            })
            $(".endDate").each(function(){
                $(this).pickadate("picker").set("disable", [
                    { from: [1970,1,1], to: new Date($.now()-day_1)}
                ]);
            })
        },
        "addQuote" : function(){
            var that=this,
                quoteDefault=$("#insertContent").html(),
                quoteDefaultTwice=$("#secondInsertContent").html();

            $(".addQuoteBtn").on("click",function(){

                var $projectInfoContent= $(this).parents(".projectHeader").siblings(".projectInfoContent"),
                    quotepriceunit=$(this).attr("data-quotepriceunit");

                if($projectInfoContent.find(".addQuoteWrap").length==10){
                    $(".modal_2").modal("show");
                    $("#modalInfo_2").text("一个项目最多可以报价十次");
                    $("#md_ok_2").off("click").on("click",function(){
                        $(".modal_2").modal("hide");
                    });
                    return false;
                }
                //添加报价默认的5项

                //获取该项目的模板
                var template=$(this).parents(".projectInner").find('.tempInsert').html();
                //插入+++
                //判断是否第一次添加
                if($projectInfoContent.children(".addQuote").length>0){
                    //不是第一次添加
                    $projectInfoContent.children(".addQuote").append(quoteDefaultTwice);
                }else{
                    //是第一次添加
                    $projectInfoContent.append(quoteDefault);
                }

                //main add
                $projectInfoContent.find(".addQuote .addQuoteWrap").last().find(".tableWrap").append(template);

                $projectInfoContent.find(".addQuoteWrap").find(".tempName").hide();//隐藏text值
                $projectInfoContent.find(".addQuoteWrap").find(".inputWrap").show();//显示input
                //初始化select2插件
                that.select2();

                //初始化时间控件
                that.pickdate();

                //计算报价长度
                that.quoteTxt();

                that.validate();

                //判断报价单位
                if(quotepriceunit==2){
                    $projectInfoContent.find(".addQuote .addQuoteWrap").last().find(".quoteUnit").text("报价(元/百大卡·吨)");
                }else{
                    $projectInfoContent.find(".addQuote .addQuoteWrap").last().find(".quoteUnit").text("报价(元/吨)");
                }

            });
        },
        "uploadFile" : function(){
            (function(){
                // 图片上传功能
                var maxSize = 7,showUploadErr = $('#showUploadErr');
                var uploadProgress = $('#uploadProgress'),
                    progress = $('#progress'),
                    uploadList = $('#uploadList'),
                    uploadForm = $('#uploadForm');
                var userAgent = navigator.userAgent;
                if( userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 ){
                    // 如果是IE
                    $('#uploadBtn').hide();
                    $("#fileUpload").uploadify({
                        'width':100,
                        'height':30,
                        'multi':false,
                        'method':'post',
                        'fileObjName':'file',
                        'fileSizeLimit':'7MB',
                        'buttonCursor':'hand',
                        'buttonClass':'upload-btn',
                        'buttonText':'选择文件',
                        'uploader':'/tender/uploadFile;jsessionid=${pageContext.session.id}',
                        'swf':'/scripts/plugins/uploadify/uploadify.swf',
                        'onSelect' : function(file) {
                            if (file.name.length > 99) {
                                showUploadErr.html("您的文件名过长，请限制在100个字符之内").css('display','inline-block');
                                return false;
                            }
                            if (file.size && file.size > maxSize * 1024 * 1024) {
                                showUploadErr.html("您的文件过大，请限制在"+maxSize+"M之内").css('display','inline-block');
                                return false;
                            }
                        },
                        'onSelectError' : function() {
                            showUploadErr.html('请提交正确的文件格式').css('display','inline-block');
                            return false;
                        },
                        'onUploadStart':function(file) {
                            if( ['.png','.jpg','.bmp','.gif','.pdf','.zip','.xls','.xlsx','.doc','.docx'].indexOf(file.type)<0 ){
                                showUploadErr.html("请提交正确的文件格式").css('display','inline-block');
                                return false;
                            }
                            if ( file.size && file.size > maxSize * 1024 * 1024) {
                                showUploadErr.html("您的文件过大，请限制在"+maxSize+"M之内").css('display','inline-block');
                                return false;
                            }
                            function totalSizeCb(){
                                var total = 0;
                                for(var i=0;i<uploadData.length;i++){
                                    total+=uploadData[i].size/1024/1024;
                                }
                                return total;
                            }
                            if((file.size && file.size>maxSize*1024*1024 ) || (totalSizeCb()+file.size/1024/1024 > maxSize )){
                                showUploadErr.html('文件总大小不能超过7M').css('display','inline-block');
                                return false;
                            }
                            $("#uploadBtn").hide();
                            showUploadErr.hide();
                            uploadProgress.show();
                            progress.css('width','0');
                        },
                        'onUploadProgress':function(file,bytesUploaded,bytesTotal,totalBytesUploaded,totalBytesTotal) {
                            progress.stop().animate({"width": bytesUploaded/bytesTotal*100 + "%"}, 200);
                        },
                        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
                            showUploadErr.html("上传出错，请重试").css('display','inline-block');
                            //$("#uploadBtn").show();
                            uploadProgress.hide();
                            return false;
                        },
                        'onUploadSuccess' : function(file,data,response) {
                            if(response && showUploadErr.is(':hidden')){
                                data = jQuery.parseJSON(data);
                                $('#uploadDataErr').hide();
                                setTimeout(function(){
                                    //$("#uploadBtn").show();
                                    uploadProgress.hide();
                                    uploadList.append('<li>'+file.name+'<span></span></li>');
                                    uploadData.push({
                                        filePath:data.filePath,
                                        fileName:data.fileName,
                                        size:file.size
                                    });
                                    return false;
                                },600);
                            }
                        }
                    });
                }else{
                    $('#fileUpload').hide();
                    var ssInstance = new ss.SimpleUpload({
                        button: $("#uploadBtn"),
                        url: "/tender/uploadFile",
                        name: "file",
                        multipart: true,
                        noParams: true,
                        allowedExtensions: ["png","jpg",'bmp','gif','pdf','zip','xls','xlsx','doc','docx'],
                        disabledClass: "upload-disabled",
                        method: "POST",
                        responseType: "json",
                        encodeCustomHeaders: true,
                        onChange: function (filename, extension, uploadBtn, fileSize, file) {
                            if (filename.length > 99) {
                                showUploadErr.html("您的文件名过长，请限制在100个字符之内").show();
                                return false;
                            }
                            if (fileSize && fileSize > maxSize * 1024) {
                                showUploadErr.html("您的文件过大，请限制在"+maxSize+"M之内").show();
                                return false;
                            }
                        },
                        onExtError: function () {
                            showUploadErr.html("请上传正确格式的文件").show();
                        },
                        onSubmit: function (filename, extension, uploadBtn, fileSize) {
                            if ( fileSize && fileSize > maxSize * 1024) {
                                showUploadErr.html("您的文件过大，请限制在"+maxSize+"M之内").show();
                                return false;
                            }
                            function totalSizeCb(){
                                var total = 0;
                                for(var i=0;i<uploadData.length;i++){
                                    total+=uploadData[i].size/1024;
                                }
                                return total;
                            }
                            if((fileSize && fileSize>maxSize*1024 ) || ((totalSizeCb()+fileSize/1024)>maxSize)){
                                showUploadErr.html('文件总大小不能超过7M').show();
                                ssInstance.clearQueue();
                                return false;
                            }else{
                                showUploadErr.html('');
                                if(!uploadData[uploadData.length]){
                                    uploadData[uploadData.length] = {};
                                }
                                uploadData[uploadData.length-1].size = fileSize;
                            }
                            $("#uploadBtn").hide();
                            showUploadErr.hide();
                            uploadProgress.show();
                        },
                        onComplete: function (filename, response) {
                            if( response.fileName ){
                                $('#uploadDataErr').hide();
                                setTimeout(function(){
                                    $("#uploadBtn").show();
                                    uploadProgress.hide();
                                    uploadList.append('<li>'+response.fileName+'<span></span></li>');
                                    uploadData[uploadData.length-1].filePath = response.filePath;
                                    uploadData[uploadData.length-1].fileName = response.fileName;
                                    return false;
                                },600);
                            }
                        },
                        onError: function () {
                            showUploadErr.html("上传出错，请重试").show();
                            $("#uploadBtn").show();
                            uploadProgress.hide();
                        },
                        onProgress: function (pct) {
                            progress.stop().animate({"width": pct + "%"}, 200);
                        }
                    });
                }
                uploadList.on('click','span',function(){
                    var index = uploadList.find('span').index(this);
                    $(this).parent().remove();
                    uploadData.splice(index,1);
                });
            })();

        },
        "basicValidate" : function(){
            //基本信息选中校验
            var flag=null,
                errArr={
                  "usertype" : "我的身份",
                  "enterprisetype" : "企业性质",
                  "capital": "注册资本",
                  "iscooperate" : "是否与招标商有合作",
                  "lastyearconsumenum" : "上年度经营量"
            };

            $("#basicContent p").each(function(){
                var inputChecked=$(this).find("input:checked").length,
                    pLen=$("#basicContent").find("p").length,
                    allInputLen=$("#basicContent").find("input:checked").length;
                    if(inputChecked<1){
                        var className=$(this).attr("class");
                        $(".totalErrorMsg").text(errArr[className]+"不能为空");
                        return flag=false;
                    }
                    if(pLen==allInputLen){
                        return flag=true;
                    }

            });
            return flag;
        },
        "selectBasic" : function(){
            $('#basicContent label').on("click",function(){
               $(this).siblings("label").children("i").removeClass("selected");
               $(this).children("i").addClass("selected");
            });
        },
        "validate" : function(){
            function formatTime(val){
                if( !val ){
                    return 0;
                }
                var arr = val.split(' ');
                var d = arr[0].split('-');
                var date = new Date();
                date.setUTCFullYear(d[0], d[1] - 1, d[2]);
                return date.getTime();
            }
            //校验....
            var that=this;
            flagStatus="";
            btnType="";
            $(".projectInfoContent").each(function(projectNum){
                $(this).find(".addQuote .addQuoteWrap").each(function(quoteNum){
                    var errorMsg=$(".projectInner").eq(projectNum).find(".addQuoteWrap").eq(quoteNum).find(".errMsg"),
                        formWrap=$(".projectInner").eq(projectNum).find(".addQuoteWrap").eq(quoteNum).find(".myForm");

                    if($(this).find('input').length){

                        //addMethod++++++++++
                        jQuery.validator.addMethod("floatCheck", function (value, element) {
                            return this.optional(element) || /^(\d+(\.\d)?)$/.test(value);
                        }, "只能输入一位小数");

                        jQuery.validator.addMethod("onceCheck", function (value, element) {
                            return this.optional(element) || (/^\d+(\.\d{0,2})?$/).test(value);
                        }, "最多为两位小数");

                        jQuery.validator.addMethod("numberCheck", function (value, element) {
                            var firstChar = value.substr(0, 1);
                            return this.optional(element) || firstChar != 0 || value >= 0;
                        }, "请输入合法数字");

                        jQuery.validator.addMethod("secCheck", function (value, element) {
                            var regular;
                            if (value.indexOf(".") != -1) {
                                if (value.substr(0, value.indexOf(".")).length >= 2) {
                                    if (value.substr(0, 1) == 0) {
                                        regular = 0;
                                    }
                                }
                            } else {
                                if (value.length >= 2) {
                                    if (value.substr(0, 1) == 0) {
                                        regular = 0;
                                    }
                                }
                            }
                            return this.optional(element) || regular != 0;
                        }, "请输入合法的格式");

                        jQuery.validator.addMethod("chineseCheck", function (value, element) {
                            return /^[\u4E00-\u9FA5|\w|\d]{1,50}$/.test(value);
                        }, "请输入中文");
                        ///^[\u4E00-\u9FA5|\w|\d]{1,50}$/

                        jQuery.validator.addMethod("f1", function (value, element) {
                            var thisEle=$(element).val();
                            var otherEle=$(element).siblings("input").val();
                            if((!otherEle && /^\s*$/.test(otherEle)) || !thisEle){
                                return false
                            }else{
                                return thisEle*1 <= otherEle*1
                            }
                        }, "请输入正确的区间");

                        jQuery.validator.addMethod("f2", function (value, element) {
                            var thisEle=$(element).val();
                            var otherEle=$(element).siblings("input").val();
                            if((!otherEle && /^\s*$/.test(otherEle)) || !thisEle){
                                return false
                            }else{
                                return thisEle*1 >= otherEle*1
                            }
                        }, "请输入正确的区间");

                        jQuery.validator.addMethod("timeLimit1", function (value, element) {

                            var thisEle=formatTime($(element).val());
                            var otherEle=formatTime($(element).parent().siblings(".previewTime").find("input").val());
                            return thisEle >= otherEle

                        }, "请输入正确的时间区间");

                        jQuery.validator.addMethod("selectValidate", function (value, element) {
                            return  !/^\s*$/.test(value);
                        }, "请选择颗粒度");





                        formWrap.validate({
                            onsubmit: true,
                            onkeyup: false,
                            onfocusout:false,
                            focusInvalid: true,
                            showErrors:function(errorMap,errorList) {

                                if(errorList=="" || errorList==undefined){
                                    errorMsg.text("")
                                }else{
                                    $(errorList).each(function(i,item){
                                        if(i==0){
                                            errorMsg.text(item.message)
                                            formWrap.attr("data-validate","");
                                        }
                                    });
                                }

                                this.defaultShowErrors();


                            },
                            submitHandler:function() {

                                formWrap.attr("data-validate",true);
                                var myFormLen=$(".projectInner .myForm").length,
                                    dataValidateLen=$(".projectInner .myForm[data-validate='true']").length,
                                    dataTotal=[],
                                    basicInfo=[];

                                if(myFormLen==dataValidateLen){
                                    var basicSubmitValidate=that.basicValidate();
                                    if(!basicSubmitValidate){return false;}
                                        //遍历有几个项目

                                    $(".projectInner").each(function(projectLen){
                                        var quotePriceUnit=$(".projectInner").find(".addQuoteBtn").attr("data-quotepriceunit");
                                        $(this).find(".addQuoteWrap").each(function(sequence){
                                            var price={};
                                            price = {"projectId":projectLen*1+1,"sequence":sequence*1+1,"quotePriceUnit":quotePriceUnit};

                                            $(this).find("input[type='text']").each(function(){
                                                price[$(this).attr('name')] = $(this).val();
                                            });
                                            $(this).find('select').each(function(){
                                                price[$(this).attr('name')] = $(this).val();
                                            });
                                            dataTotal.push(price);
                                        });
                                    });
                                    //基本信息数据获取
                                    $(".basicContent input").each(function(){
                                       if($(this).prop("checked")){
                                           basicInfo.push({"categoryId":$(this).attr("categoryid"),"qualityId":$(this).attr("qualityid")})
                                       }
                                    });
                                    switch(btnType){
                                        case "submit":
                                        var url ="/bid/releaseBid/"+$("#tenderId").val();
                                            break;

                                        case "updateSubmit":
                                        var url ="/bid/updateBidForRealRelease/"+$("#tenderId").val();
                                            break;

                                        case "save":
                                        var url ="/bid/tempSaveBid/"+$("#tenderId").val();
                                            break;

                                        case "updateSave":
                                        var url ="/bid/updateBidForTempSave/"+$("#tenderId").val();
                                            break;
                                    };
                                    var obj={};
                                    obj["bidProject"]=dataTotal;
                                    obj["userQualification"]=basicInfo;
                                    obj["bidFilePath"]=uploadData;
                                    if(flagStatus=="once"){return false;}
                                    //只发送一次ajax
                                    $.ajax({
                                        url:url,
                                        type:'POST',
                                        contentType: "application/json; charset=utf-8",
                                        data:JSON.stringify(obj),
                                        success:function(response){
                                            $(".close_modal").hide();
                                            $(".modal_2").modal("show");
                                            $(".bg_img").addClass("yes");
                                            if(btnType=="submit" || btnType=="updateSubmit"){
                                                $("#modalInfo_2").text("提交报价成功");
                                                $("#md_ok_2").off("click").on("click",function(){
                                                    location.href="/bid/bidSuccess?tenderId="+$("#tenderId").val();
                                                });

                                            }else{
                                                $("#modalInfo_2").text("保存报价成功");
                                                $("#md_ok_2").off("click").on("click",function(){
                                                    location.href="/account/bidDraft"
                                                });
                                            }
                                          }
                                    });
                                    flagStatus="once";
                                }
                            },
                            rules:{
                                supplyAmount: {
                                    range:[0.01,50],
                                    onceCheck:true
                                },
                                price:{
                                    range:[1,150000],
                                    onceCheck:true
                                },
                                deliveryPlace:{
                                    chineseCheck:true,
                                    maxlength:10
                                },
                                deliveryStartTime:{
                                },
                                deliveryEndTime:{
                                    timeLimit1:true
                                },
                                coalStr:{
                                    chineseCheck:true,
                                    maxlength:10
                                },
                                origin:{
                                    chineseCheck:true,
                                    maxlength:10
                                },
                                NCV:{
                                    digits: true,
                                    range: [1, 7500],
                                    f1:true
                                },
                                NCV2:{
                                    digits: true,
                                    range: [1, 7500],
                                    f2:true
                                },
                                RS:{
                                    secCheck: true,
                                    range: [0.01, 10],
                                    onceCheck: true,
                                    f1:true
                                },
                                RS2:{
                                    secCheck: true,
                                    range: [0.01, 10],
                                    onceCheck: true,
                                    f2:true
                                },
                                ADV:{
                                    numberCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    onceCheck: true,
                                    f1:true
                                },
                                ADV2:{
                                    numberCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    onceCheck: true,
                                    f2:true
                                },
                                TM:{
                                    secCheck: true,
                                    range: [0.01, 50],
                                    onceCheck: true,
                                    f1:true
                                },
                                TM2:{
                                    secCheck: true,
                                    range: [0.01, 50],
                                    onceCheck: true,
                                    f2:true
                                },
                                ASH:{
                                    numberCheck: true,
                                    floatCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    f1:true
                                },
                                ASH2:{
                                    numberCheck: true,
                                    floatCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    f2:true
                                },
                                AFT:{
                                    digits: true,
                                    range: [900, 1800],
                                    f1:true
                                },
                                AFT2:{
                                    digits: true,
                                    range: [900, 1800],
                                    f2:true
                                },
                                FC:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f1:true
                                },
                                FC2:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f2:true
                                },
                                CRC:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f1:true
                                },
                                CRC2:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f2:true
                                },
                                GV:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f1:true
                                },
                                GV2:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f2:true
                                },
                                YV:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f1:true
                                },
                                YV2:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f2:true
                                },
                                IM:{
                                    onceCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    f1:true
                                },
                                IM2:{
                                    onceCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    f2:true
                                },
                                ADS:{
                                    range: [0.01, 10],
                                    secCheck: true,
                                    onceCheck: true,
                                    f1:true
                                },
                                ADS2:{
                                    range: [0.01, 10],
                                    secCheck: true,
                                    onceCheck: true,
                                    f2:true
                                },
                                RV:{
                                    numberCheck: true,
                                    onceCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    f1:true
                                },
                                RV2:{
                                    numberCheck: true,
                                    onceCheck: true,
                                    secCheck: true,
                                    range: [0.01, 50],
                                    f2:true

                                },
                                HGI:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f1:true
                                },
                                HGI2:{
                                    digits: true,
                                    range: [1, 100],
                                    numberCheck: true,
                                    f2:true
                                },
                                PS:{
                                    selectValidate:true
                                }

                            },
                            messages: {
                                supplyAmount:{
                                    required: "请输入供应量",
                                    range:"供应量范围为0-50万吨[不包含0]",
                                    onceCheck:"供应量最多保存两位小数"
                                },
                                price:{
                                    required: "请输入报价",
                                    range:"报价范围为1-150000元",
                                    onceCheck:"报价最多保存两位小数"
                                },
                                deliveryPlace:{
                                    required: "请输入发运站/港",
                                    chineseCheck:'发运站/港必须汉字、英文、或数字',
                                    maxlength:'发运站/港最多为10个字'
                                },
                                deliveryStartTime:{
                                    required: "请输入预计到厂时间"
                                },
                                deliveryEndTime:{
                                    required: "请输入预计到厂时间"
                                },
                                coalStr:{
                                    required: "请输入煤种",
                                    chineseCheck:'煤种必须为汉字、英文、或数字',
                                    maxlength:'煤种最多为10个字'
                                },
                                origin:{
                                    required: "请输入产地",
                                    chineseCheck:'产地必须为汉字、英文、或数字',
                                    maxlength:'产地最多为10个字'
                                },
                                NCV:{
                                    required: "请输入热值",
                                    digits: "请输入整数",
                                    range: $.validator.format("热值必须为1-7500之间的整数!"),
                                    f1:"热值请输入正确的区间"
                                },
                                NCV2:{
                                    required: "请输入热值",
                                    digits: "请输入整数",
                                    range: $.validator.format("热值必须为1-7500之间的整数!"),
                                    f2:"热值请输入正确的区间"
                                },
                                RS:{
                                    required: "请输入收到基硫分",
                                    range: $.validator.format("收到基硫分必须为0-10之间的数值!"),
                                    onceCheck:"收到基硫分最多为两位小数",
                                    f1:"基硫分请输入正确的区间"
                                },
                                RS2:{
                                    required: "请输入收到基硫分",
                                    range: $.validator.format("收到基硫分必须为0-10之间的数值!"),
                                    onceCheck:"收到基硫分最多为两位小数",
                                    f2:"基硫分请输入正确的区间"
                                },
                                ADV:{
                                    required: "请输入空干基挥发",
                                    range: $.validator.format("空干基挥发必须为0-50之间的数值[不包括0]!"),
                                    digits: "空干基挥发分只能输入整数",
                                    onceCheck: "空干基挥发分最多为两位小数",
                                    f1:"空干基挥发分请输入正确的区间"
                                },
                                ADV2:{
                                    required: "请输入空干基挥发",
                                    range: $.validator.format("空干基挥发必须为0-50之间的数值[不包括0]!"),
                                    digits: "空干基挥发分只能输入整数",
                                    onceCheck: "空干基挥发分最多为两位小数",
                                    f2:"空干基挥发分请输入正确的区间"
                                },
                                TM:{
                                    required: "请输入全水分",
                                    range: $.validator.format("全水分必须为0-50之间的数值[不包括0]!"),
                                    onceCheck: "请输入全水分最多为两位小数",
                                    f1:"全水分请输入正确的区间"
                                },
                                TM2:{
                                    required: "请输入全水分",
                                    range: $.validator.format("全水分必须为0-50之间的数值[不包括0]!"),
                                    onceCheck: "请输入全水分最多为两位小数",
                                    f2:"全水分请输入正确的区间"
                                },
                                ASH:{
                                    required: "请输入灰分",
                                    range: $.validator.format("灰分必须为0-50之间的数值[不包括0]!"),
                                    floatCheck:"灰分最多输入一位小数",
                                    f1:"灰分请输入正确的区间"
                                },
                                ASH2:{
                                    required: "请输入灰分",
                                    range: $.validator.format("灰分必须为0-50之间的数值[不包括0]!"),
                                    floatCheck:"灰分最多输入一位小数",
                                    f2:"灰分请输入正确的区间"
                                },
                                AFT:{
                                    required: "请输入灰熔点",
                                    range: $.validator.format("灰熔点必须为900-1800之间的整数!"),
                                    digits: "灰熔点必须输入整数",
                                    f1:"灰熔点请输入正确的区间"
                                },
                                AFT2:{
                                    required: "请输入灰熔点",
                                    range: $.validator.format("灰熔点必须为900-1800之间的整数!"),
                                    digits: "灰熔点必须输入整数",
                                    f2:"灰熔点请输入正确的区间"
                                },
                                FC:{
                                    required: "请输入固定碳",
                                    range: $.validator.format("固定碳必须为0-100之间的整数!"),
                                    digits: "固定碳必须输入整数",
                                    f1:"固定碳请输入正确的区间"
                                },
                                FC2:{
                                    required: "请输入固定碳",
                                    range: $.validator.format("固定碳必须为0-100之间的整数!"),
                                    digits: "固定碳必须输入整数",
                                    f2:"固定碳请输入正确的区间"
                                },
                                CRC:{
                                    required: "请输入焦渣特征",
                                    range: $.validator.format("焦渣特征必须为0-100之间的整数!"),
                                    digits: "焦渣特征必须输入整数",
                                    f1:"焦渣特征请输入正确的区间"
                                },
                                CRC2:{
                                    required: "请输入焦渣特征",
                                    range: $.validator.format("焦渣特征必须为0-100之间的整数!"),
                                    digits: "焦渣特征必须输入整数",
                                    f2:"焦渣特征请输入正确的区间"
                                },
                                GV:{
                                    required: "请输入G值",
                                    range: $.validator.format("G值必须为0-100之间的整数!"),
                                    digits: "G值必须输入整数",
                                    f1:"G值请输入正确的区间"
                                },
                                GV2:{
                                    required: "请输入G值",
                                    range: $.validator.format("G值必须为0-100之间的整数!"),
                                    digits: "G值必须输入整数",
                                    f2:"G值请输入正确的区间"
                                },
                                YV:{
                                    required: "请输入Y值",
                                    range: $.validator.format("Y值必须为0-100之间的整数!"),
                                    digits: "Y值必须输入整数",
                                    f1:"Y值请输入正确的区间"
                                },
                                YV2:{
                                    required: "请输入Y值",
                                    range: $.validator.format("Y值必须为0-100之间的整数!"),
                                    digits: "Y值必须输入整数",
                                    f2:"Y值请输入正确的区间"
                                },
                                IM:{
                                    required: "请输入内水分",
                                    range: $.validator.format("内水分必须为一个介于0-50之间的数值[不包括0]!"),
                                    onceCheck:"内水分最多为两位小数",
                                    f1:"内水分请输入正确的区间"
                                },
                                IM2:{
                                    required: "请输入内水分",
                                    range: $.validator.format("内水分必须为一个介于0-50之间的数值[不包括0]!"),
                                    onceCheck:"内水分最多为两位小数",
                                    f2:"内水分请输入正确的区间"
                                },
                                ADS:{
                                    required: "请输入空干基硫分",
                                    range:"空干基硫分必须为一个介于0-10之间的数值[不包括0]!",
                                    onceCheck: "空干基硫分最多为两位小数",
                                    f1:"空干基硫分请输入正确的区间"
                                },
                                ADS2:{
                                    required: "请输入空干基硫分",
                                    range:"空干基硫分必须为一个介于0-10之间的数值[不包括0]!",
                                    onceCheck: "空干基硫分最多为两位小数",
                                    f2:"空干基硫分请输入正确的区间"
                                },
                                RV:{
                                    required: "请输入收到基挥发分",
                                    range: $.validator.format("收到基挥发分必须为一个介于0-50之间的数值[不包括0]!"),
                                    digits: "收到基挥发分只能输入整数",
                                    onceCheck:"收到基挥发分最多为两位小数",
                                    f1:"收到基挥发分请输入正确的区间"
                                },
                                RV2:{
                                    required: "请输入收到基挥发分",
                                    range: $.validator.format("收到基挥发分必须为一个介于0-50之间的数值[不包括0]!"),
                                    digits: "收到基挥发分只能输入整数",
                                    onceCheck:"收到基挥发分最多为两位小数",
                                    f2:"收到基挥发分请输入正确的区间"
                                },
                                HGI:{
                                    required: "请输入哈氏可磨",
                                    range:"哈氏可磨只能输入0-100的整数",
                                    digits: "哈氏可磨只能输入整数",
                                    f1:"哈氏可磨请输入正确的区间"

                                },
                                HGI2:{
                                    required: "请输入哈氏可磨",
                                    range:"哈氏可磨只能输入0-100的整数",
                                    digits: "哈氏可磨只能输入整数",
                                    f2:"哈氏可磨请输入正确的区间"
                                },
                                PS:{
                                    selectValidate:"请选择颗粒度"
                                }
                            }
                        });
                    }
                });
            });

        },
        "submit" : function(){
            $(".btnWrap a").on("click",function(){
                flagStatus="";
                //判断点击那个按钮
                if($(this).hasClass("btnSubmit")){
                    if($("#updateFlag").val()==""){
                        btnType="submit";
                    }else{
                        btnType="updateSubmit";
                    }
                }else{
                    if($("#updateFlag").val()==""){
                        btnType="save";
                    }else{
                        btnType="updateSave";
                    }
                }
                //判断是否有报价，有报价则进行校验
                var quoteLen=$(".projectInner .addQuote").find(".addQuoteWrap").length;
                if(quoteLen){
                    $(".totalErrorMsg").text("");
                    $(".submitForm").submit();
                }else{
                    $(".totalErrorMsg").text("请您添加报价");
                }
            });
        }

    };
    quote.init();
    })
});