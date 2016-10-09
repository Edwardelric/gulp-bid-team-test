require(['jquery','bootstrap-sass'],function($) {


    //**********************************全选和行选择操作********************
    //removeClass和addClass不起作用,因为jQuery对元素没有初始化
    $("#emptyBoxTh").click(function(){
        $(this).hide();
        $("#tickBoxTh").show();
        $(".emptyBoxTd").hide();
        $(".tickBoxTd").show();
    });

    $("#tickBoxTh").click(function(){
        $(this).hide();
        $("#emptyBoxTh").show();
        $(".tickBoxTd").hide();
        $(".emptyBoxTd").show();
    });

    $(".emptyBoxTd").click(function(){
        $(this).hide();
        $(this).siblings(".tickBoxTd").show();
    });

    $(".tickBoxTd").click(function(){
        $(this).hide();
        $(this).siblings(".emptyBoxTd").show();
        if($("#tickBoxTh").is(':visible')){
            $("#tickBoxTh").hide();
            $(".emptyBoxTh").show();
        }
    });

    //**********************************应标和查看******************
    $(".opt").on('click',function(){
        if(checkStatus($("#tenderId").val())){
            location.href=($(this).attr("href"));
        }else{
            $(".error-dialog").modal('show');
        }
    });

    function checkStatus(tenderId){
        var result=false;
        $.ajax({
            async: false,
            type:"POST",
            url: '/tender/validateTender/'+tenderId,
            success: function (data) {
                if(data.success){
                    result=true;
                }else{
                    if(data.status=="tenderIsNotExists" || data.status=="tenderEnd"){
                        result=false;
                    }else{
                        result=false;
                    }
                }
            }
        });
        return result;
    }

    //**********************************全选和行选择操作******************

    //导出投标记录
    $(".export").click(function(){
        $(".noSelectTip").hide();
        var flag = false;
        var exportArr=[];
        $("#openBidTable").find('.tickBoxTd',this).each(function(){
            if($(this).is(':visible')){
                exportArr.push($(this).attr("data-value"));
                flag = true;
            }
        });

        var declareId = $("#declareId").val();
        if(flag){
            location.href="/bid/downloadBidRecord/"+declareId+"?projectIds="+exportArr;
        }else{
            $(".noSelectTip").show();
            return;
        }

    });


    //修改
    $(".optBtn").click(function(){
        if(checkStatus($("#tenderId").val())){
            $("#btn-template").data("packetId",$(this).data("value"));
            alterTempHtml($(this).data("value"));
        }else{
            $(".error-dialog").modal('show');
        }
    });

    //模态框隐藏
    $(".dialog-cancel").on('click',function(){
        var type=$(this).data("type");
        $("."+type+"-dialog").modal('hide');
        if(type=="error"){
            location.href="/account/mytender";
        }
    });

    function alterTempHtml(packetId){
        var tenderId= $("#declareId").val();
        $.ajax({
            url: '/account/listAllTenderTpl',
            data:{tenderId:tenderId,projectId:packetId},
            type:'POST',
            success: function (data) {
                if(data.success) {
                    $(".template-dialog").modal('show');
                    var tbody = $(".template-table").find("tbody");
                    tbody.find("tr").remove();
                    var list = data.tplList;
                    var html;
                    for (var i = 0; i < list.length; i++) {
                        html = "<tr>";
                        if (data.configuredId == list[i].id) {
                            html += "<td width='40'><i class='radio-btn radio-blue m-l-0 radio-template' data-id='"+list[i].id+"'></i></td>"
                        } else {
                            html += "<td width='40'><i class='radio-btn m-l-0 radio-template' data-id='"+list[i].id+"'></i></td>"
                        }
                        html += "<td><a href='/account/myTenderTpl/detail/"+list[i].id+"' target='_blank'>"+list[i].tplName+"</a></td>";
                        if (data.configuredId == list[i].id) {
                            html += "<td class='no-padding' width='40'><span class='config-color'>已配置</span></td>";
                        } else {
                            html += "<td class='no-padding' width='40'></td>";
                        }
                        tbody.append(html);
                    }
                }else{
                    $("#createTempDialog").modal('show');
                }
            }
        });
    }

    //模版选择按钮
    $(document).on('click',".radio-template",function(){
        $(".radio-template").removeClass("radio-blue");
        $(this).addClass("radio-blue");
    });
    //模态框确定
    $("#btn-template").click(function(){
        var tenderId=$("#tenderId").val();
        if($(".radio-template.radio-blue").length>0) {
            $(".errorTip").hide();
            var $this = $(this);
            $.ajax({
                url: '/account/setUpTenderTpl',
                type:'POST',
                data: {tenderId:tenderId,projectId: $this.data("packetId"), tplId: $(".radio-template.radio-blue").data("id")},
                success: function (data) {
                    if (data=='success') {
                        //保存成功后刷新页面
                        $(".template-dialog").modal('hide');
                        location.reload();
                    }
                }
            });
        }else{
            $(".errorTip").show();
        }
    });

    //模态框确定
    $(".sureBtn").click(function(){
        var tenderId=$("#tenderId").val();
        $(".errorTip").hide();
        var templateId;
        var flag = false;
        $(".templateTable").find('.radio-blue',this).each(function(){
            if($(this).is(':visible')){
                flag = true;
                templateId = $(this).siblings("input").val();
            }
        });
        if(flag){
            $("#bidDialog").modal('hide');
            var packetId = $("#packetId").val();
            $.ajax({
                url: '/account/setUpTenderTpl',
                type:'POST',
                data: {tenderId:tenderId,projectId: packetId,tplId: templateId},
                success: function (data) {
                    if(data=='success'){
                        //保存成功后刷新页面
                        location.reload();
                    }
                }
            });
        }else{
            $(".errorTip").show();
        }
    });


    //没配置评分模板提示
    $(".export").hover(function(){
        $(".noTempFloatTip").show();
    },function(){
        $(".noTempFloatTip").hide();
    });


    //模态框居中
    $('.modal').on('show.bs.modal', function(){
        var $this = $(this);
        var $modal_dialog = $this.find('.modal-dialog');
        $this.css('display', 'block');
        $this.find('.modal-dialog').css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2) });
    });


    //点击tab
    $(".tab").click(function(){
        $(this).removeClass("otherTab").addClass("currentTab").siblings(".tab").removeClass("currentTab").addClass("otherTab");
        var id = $(this).attr("id");
        if(id =="tab2"){
            $(".currentLine").animate({left:"138px",width:"120px"},"normal");
            $("#resultTable1").hide();
            $("#resultTable2").show();
        }else{
            $(".currentLine").animate({left:"0",width:"133px"},"normal");
            $("#resultTable2").hide();
            $("#resultTable1").show();
        }
    });

    //行悬停显示操作按钮
    $("#openBidTable tbody tr").hover(function(){
        $(this).find("button").show();
    },function(){
        $(this).find("button").hide();
    });

    //应标结果  修改
    $(".opt2").click(function(){
        var bidRecordId = $(this).attr("data-id"),
            bidId = $(this).attr("data-bidid"),
            dataIndex=$(this).parents(".controlWrap").index(),
            dataAmount=(($(this).attr("data-amount")*1)/10000).toFixed(2),
            projectId = $(this).attr("data-projectid");

        if(checkStatus($("#tenderId").val())){
            $("#bidId").val($(this).attr("data-id"));
            $("#modalCompany").text($(this).attr("data-company"));
            $("#modalPrice").text($(this).attr("data-price")+'元/吨');
            $("#modalAmount").text($(this).attr("data-bidSupplyAmount")+'万吨');
            $("#withoutUnit").val($(this).attr("data-bidSupplyAmount"));
            $("#amount").val($(this).attr("data-needamount"));

            $('#btn-sure')
                .attr("data-Id", bidRecordId)
                .attr("data-bidId", bidId)
                .attr("data-index",dataIndex)
                .attr("data-projectId", projectId);
            $(".commit-dialog").modal('show');
            //点击修改赋值
            $("#amount").val(dataAmount);
        }else{
            $(".error-dialog").modal('show');
        }
    });


    $("#btn-sure").click(function(){
        $(".modalErrorTip").text("").hide();
        var bidId = $("#bidId").val();

        var amount = $("#amount").val(),
            tenderId = $("#tenderId").val(),
            bidId = $(this).attr("data-bidId"),
            bidRecordId = $(this).attr("data-Id"),
            withoutUnit=$("#withoutUnit").val()*1,
            projectId = $(this).attr("data-projectId");

        if(amount =="" || amount==0){
            $(".modalErrorTip").text("授予数量不得为空").show();
            return;
        }else if(amount>withoutUnit){
            $(".modalErrorTip").text("授予数量不能大于提报数量").show();
            return;
        }
        else{
            var reg = /^\d+(\.\d{0,2})?$/;
            if(!reg.test(amount)){
                $(".modalErrorTip").text("请输入数字,限制在两位小数以内").show();
                return;
            }

        }

        $.ajax({
            url: '/account/handleAnswerBid/'+bidId,
            type:'POST',
            data:{
                bidRecordId: bidRecordId,
                tenderId: tenderId,
                amount: amount,
                projectId: projectId
            },
            success: function (data) {
                $(".commit-dialog").modal('hide');
                location.reload();

            }
        });

    });
    $(".commit-cancel").on("click",function(){
        $(".modalErrorTip").text("");
    });


    $(".resultBtn").click(function(){
        if(checkStatus($("#tenderId").val())){
            $("#tipDialog").modal('show');
        }else{
            $(".error-dialog").modal('show');
        }
    });

    function submitTender(){

        var tenderId = $("#tenderId").val(),
            bidArray=[],
            bidIdArray=[];

        $(".opt2").each(function(){
            var dataId=$(this).attr("data-id");
            var bidId=$(this).attr("data-bidid");
            bidArray.push(dataId);
            bidIdArray.push(bidId);
        });
        var bidRecordIds=bidArray.join(",");
        var winBidIds=bidIdArray.join(",");

        $.ajax({
            url:'/account/submitAnswerBid/'+tenderId,
            type:'POST',
            data:{bidRecordIds:bidRecordIds,winBidIds:winBidIds},
            success:function(data){
                if(data){
                    location.href='/account/myTender';
                }else{
                    alert("选标保存失败，请重试！");
                }

            }
        });
    }

    $("#modalSureBtn").click(function(){
        submitTender();
    });

});
