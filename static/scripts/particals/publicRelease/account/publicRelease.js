require(['jquery','bootstrap-sass','common','datePicker','ueconfig','ueall','select2'],function($){
    $(document).ready(function(){
        var publicRelease={
        "init" : function(){
            this.select2();
            this.editInit();
            this.datePicker();
            this.label();
            this.submit();

        },
        "editInit" : function(){

            var that=this;
            //获取默认文本
            var divEditInner=$(".divEditInner").text();

               ue = UE.getEditor('editContainer', {
                 toolbars: [
                     ['fontsize','underline','inserttitle','forecolor','bold','indent','justifyleft','justifycenter','justifyright','justifyjustify','inserttable','backcolor']
                 ],
                 serverUrl:'',
                 autoHeightEnabled: false,
                 autoFloatEnabled: true,
                 enableAutoSave:false,
                 initialFrameWidth:837,
                 initialFrameHeight:432,
                 fontsize:[12,16,24,30,45,60],
                 maximumWords:1000,
                 maxUndoCount:5,
                 range:1,
                 saveInterval: (60*60*24),
                 enableContextMenu:false,
                 allHtmlEnabled:true,
                 autoSyncData:false,
                 elementPathEnabled:false,
                 initialContent:divEditInner
             });
            var saveInner="";
            ue.on("keydown",function(){
                var contentLen = ue.getContentLength(true);
                if(contentLen<=1000){
                    saveInner=ue.getContent();
                }
            });
            ue.on("keyup",function(){
                var contentLen = ue.getContentLength(true);
                if(contentLen>1000){
                    $(".errorMsg").text("公示内容最多可以输入1000字");
                    ue.setContent(saveInner);
                }
            });
            $("#previewBtn").click(function(){
                var innerContent=ue.getContent();
                var contentLen = ue.getContentLength(true);
                if(contentLen>1000){
                    $(".errorMsg").text("公示内容最多可以输入1000字");
                    return false
                }else{
                    $(".errorMsg").text("")
                }
                $("#editInner").val(ue.getContent());

                var result=that.validate();
                if(!result){return false;}

                $("#publicForm").submit();
            })
         },
        "select2" : function(){
            $("#projectName").select2({
                minimumResultsForSearch: Infinity
            });
            $("#projectName").on("select2:select",function(){
                var proVal=$(this).val(),
                    flagName=$(this).find("option:selected").attr("data-type");

                $("#projectNum").val(proVal);

                if(flagName=="TENDER_RELEASE_RESULT"){
                    $("#flagName").val("中标公告");
                    $("#publicType").val("1");
                } else if(flagName=="TENDER_INVALID"){
                    $("#flagName").val("流标公告");
                    $("#publicType").val("2");
                } else {
                    $("#flagName").val("");
                    $("#publicType").val("");
                }
                //tenderId赋值
                $("#tenderId").val($('#projectName option:checked').attr('data-id'));
            });
        },
        "datePicker" : function(){
            var startDate=$("#startDate"),
                endDate=$("#endDate"),
                datePackerSettings = {
                    monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    weekdaysFull: ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                    weekdaysShort: ['日','一', '二', '三', '四', '五', '六'],
                    format: 'yyyy-mm-dd'
                },
                day_1 = 86400000;

                var startLimit=startDate.pickadate(datePackerSettings).pickadate('picker');
                var endLimit=endDate.pickadate(datePackerSettings).pickadate('picker');
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
                //开始时间大于今天限制
                startLimit.set("disable", [
                    { from: [1970,1,1], to: new Date($.now()-day_1)}
                ]);
                endLimit.set("disable", [
                    { from: [1970,1,1], to: new Date($.now()-day_1)}
                ]);
                //截止时间大于开始时间
                startDate.on("change",function(){
                    endLimit.set("disable", [
                        { from: [1970,1,1], to:  new Date(startDate.val())}
                    ]);
                });
                //开始时间小于截止时间
                startDate.on("change",function(){
                    if(formatTime(startDate.val()) >formatTime(endDate.val())){
                        endDate.val("");
                    }
                });
                //截止时间必须大于开始时间（针对ie）
                endDate.on("change",function(){
                    if(formatTime(startDate.val()) > formatTime(endDate.val())){
                        endDate.val("");
                    }
                });
        },
        "label" : function(){
            $(".bidUnSelect").on("click",function(){
                $(this).parent(".bidLabel").children("label").removeClass("bidSelect");
                $(this).addClass("bidSelect");
            })
        },
        "validate" : function(flag){
            var resultValidate="";
            //验证是否为空
            function errorValidate(val,txt){
                if(val=="" || val==null){
                    $(".errorMsg").text(txt);
                    return false;
                }else{
                    $(".errorMsg").text("");
                    return true;
                }
            }
            //长度验证
            function lenValidate(val,txt,len){
                if(val.length <= len){
                    $(".errorMsg").text("");
                    return true;
                }else{
                    $(".errorMsg").text(txt);
                    return false;
                }
            }
            //验证电话号
            function validatePhone(){
                var partten = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|2|3|6|7|8|9]|18[8|9])\d{8}$)/;
                if(partten.test($("#monitorPhone").val()) || $("#monitorPhone").val()==""){
                    $(".errorMsg").text("");
                    return true
                }else{
                    $(".errorMsg").text("请输入正确的监督电话(手机号或固话)");
                    return false
                }
            }
            //日期必须同时输入
            function dateInput(){
                if(($("#startDate").val()!="" && $("#endDate").val()=="") || (($("#startDate").val()=="" && $("#endDate").val()!=""))){
                    $(".errorMsg").text("请补全公示时间");
                    return false;
                }else{
                    $(".errorMsg").text("");
                    return true;
                }
            }
                if(flag=="submit"){
                    return resultValidate=
                        errorValidate($("#projectName").val(),"项目名称不能为空") &&
                        errorValidate($("#publicName").val(),"公示名称不能为空") &&
                        lenValidate($("#publicName").val(),"公式名称最多50个字",50) &&
                        validatePhone() &&
                        dateInput() &&
                        errorValidate($("#startDate").val(),"公示时间不能为空") &&
                        errorValidate($("input[name='noticeScope']:checked").val(),"请选择公示范围") &&
                        errorValidate($("#monitorPhone").val(),"监督电话不能为空") &&
                        errorValidate($("#monitorDepartment").val(),"监督部门不能为空") &&
                        lenValidate($("#monitorDepartment").val(),"监督部门最多为50个字",50) &&
                        errorValidate(ue.getContent(),"公示内容不能为空");
                }else{
                    return resultValidate=errorValidate($("#projectName").val(),"项目名称不能为空");
                }

        },
        "submit" : function(){
            var that=this;
            //弹窗确认
            $("#md_ok_2").off("click").on("click",function(){
                $(".modal_2").modal("hide");
            });
            //提交按钮开始
            $("#submitBtn,#saveBtn").on("click",function(){
                var th=$(this);
                var contentLen = ue.getContentLength(true);
                if(contentLen>1000){
                    $(".errorMsg").text("公示内容最多可以输入1000字");
                    return false
                }else{
                    $(".errorMsg").text("")
                }

                //提交编辑器内容
                $("#editInner").val(ue.getContent());
                if(th.attr("id")=="submitBtn"){
                    //提交校验
                    var result=that.validate("submit");
                    if(!result){return false;}

                    $.ajax({
                        url:'/account/releaseTenderNotice',
                        type:'POST',
                        data:$("#publicForm").serialize(),
                        success: function(){
                            $(".modal_2").modal("show");
                            $(".modal_2 .bg_img").addClass("yes");
                            $("#modalInfo_2").text("提交成功");
                        }
                    });

                }else{
                    var result=that.validate();
                    if(!result){return false;}
                    $.ajax({
                        url:'/account/tempSaveTenderNotice',
                        type:'POST',
                        data:$("#publicForm").serialize(),
                        success: function(){
                            $(".modal_2").modal("show");
                            $(".modal_2 .bg_img").addClass("yes");
                            $("#modalInfo_2").text("保存成功");
                        }
                    });
                }
                //确认跳转
                $("#md_ok_2").off("click").on("click",function(){
                    //清空select2
                    $("#projectName").select2().val("").trigger("change");
                    location.href='/account/myTenderNotice';
                });

            });

        }
        };
        publicRelease.init();
    })
});