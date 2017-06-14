require(['jquery', 'bootstrap-sass', 'tmpl'], function ($) {


    //**********************************全选和行选择操作********************
    //removeClass和addClass不起作用,因为jQuery对元素没有初始化
    $("#emptyBoxTh").click(function () {
        $(this).hide();
        $("#tickBoxTh").show();
        $(".emptyBoxTd").hide();
        $(".tickBoxTd").show();
    });

    $("#tickBoxTh").click(function () {
        $(this).hide();
        $("#emptyBoxTh").show();
        $(".tickBoxTd").hide();
        $(".emptyBoxTd").show();
    });

    $(".emptyBoxTd").click(function () {
        $(this).hide();
        $(this).siblings(".tickBoxTd").show();
    });

    $(".tickBoxTd").click(function () {
        $(this).hide();
        $(this).siblings(".emptyBoxTd").show();
        if ($("#tickBoxTh").is(':visible')) {
            $("#tickBoxTh").hide();
            $(".emptyBoxTh").show();
        }
    });

    //**********************************应标和查看******************
    $(".opt").on('click', function () {
        if (checkStatus($("#declareId").val())) {
            window.open("/tender/answerBid/" + $(this).data("value"));
        } else {
            $(".error-dialog").modal('show');
        }
    });

    function checkStatus(declareId) {
        var result = false;
        $.ajax({
            async: false,
            type: "POST",
            url: '/tender/validateTender/' + declareId,
            success: function (data) {
                if (data.success) {
                    result = true;
                } else {
                    if (data.status == "tenderIsNotExists" || data.status == "tenderEnd") {
                        result = false;
                    } else {
                        result = false;
                    }
                }
            }
        });
        return result;
    }

    //**********************************全选和行选择操作******************

    //导出投标记录
    $(".export").click(function () {
        $(".noSelectTip").hide();
        var flag = false;
        var exportArr = [];
        $("#openBidTable").find('.tickBoxTd', this).each(function () {
            if ($(this).is(':visible')) {
                exportArr.push($(this).attr("data-value"));
                flag = true;
            }
        });

        var declareId = $("#declareId").val();
        if (flag) {
            location.href = "/tender/downloadTenderPdf/" + declareId + "?packetIds=" + exportArr;
        } else {
            $(".noSelectTip").show();
            return;
        }

    });


    //评标模态框显示
    $("#btn-bid").click(function () {
        if (checkStatus($("#tenderId").val())) {
            $("#btn-template").data("packetId", $(this).data("value"));
            alterTempHtml($(this).data("value"));
        } else {
            $(".error-dialog").modal('show');
        }
    });
    //模态框隐藏
    $(".dialog-cancel").on('click', function () {
        var type = $(this).data("type");
        $("." + type + "-dialog").modal('hide');
        if (type == "error") {
            location.href = "/account/mytender";
        }
    });

    function alterTempHtml(packetId) {
        $.ajax({
            url: '/account/listAllTenderTpl',
            type:'POST',
            data: {tenderId: $("#tenderId").val()},
            success: function (data) {
                if (data.success) {
                    $(".template-dialog").modal('show');
                    var tbody = $(".template-table").find("tbody");
                    tbody.find("tr").remove();
                    var list = data.tplList;
                    var html;
                    for (var i = 0; i < list.length; i++) {
                        html = "<tr>";
                        if (data.configuredId == list[i].id) {
                            html += "<td width='40'><i class='radio-btn radio-blue m-l-0 radio-template' data-id='" + list[i].id + "'></i></td>"
                        } else {
                            html += "<td width='40'><i class='radio-btn m-l-0 radio-template' data-id='" + list[i].id + "'></i></td>"
                        }
                        html += "<td><a href='/account/myTenderTpl/detail/" + list[i].id + "' target='_blank'>" + list[i].tplName + "</a></td>";
                        if (data.configuredId == list[i].id) {
                            html += "<td class='no-padding' width='40'><span class='config-color'>已配置</span></td>";
                        } else {
                            html += "<td class='no-padding' width='40'></td>";
                        }
                        tbody.append(html);
                    }
                } else {
                    $("#evaluation-dialog").modal('show');
                }
            }
        });
    }

    //模版选择按钮
    $(document).on('click', ".radio-template", function () {
        $(".radio-template").removeClass("radio-blue");
        $(this).addClass("radio-blue");
    });
    //模态框确定
    $("#btn-template").click(function () {
        var tenderId=$("#tenderId").val();
        var qualityStr=[];
        $(".filterBlock").each(function(){
            if($(this).find(".selected").siblings("span.all").length<1){
                qualityStr.push($(this).find(".selected").attr("data-quality"));
            }
        });
        var orderType=$(this).attr("data-sort"),
            qualityIds=qualityStr.join(",");

        if ($(".radio-template.radio-blue").length > 0) {
            $(".errorTip").hide();
            var $this = $(this);
            $.ajax({
                url: '/account/changeTpl/' + tenderId,
                type: 'POST',
                data: {
                    tenderId: tenderId,
                    projectId: $this.data("packetId"),
                    tplId: $(".radio-template.radio-blue").data("id"),
                    qualityIds: qualityIds,
                    orderType: orderType
                },
                success: function (response) {

                    //保存成功后刷新页面
                    var bidTmpl = $("#bidTmpl").html(),
                        bidControlTmpl = $("#bidControlTmpl").html();
                    var bidingArray = [];

                    $.template("bidTemplate", bidTmpl);
                    $.template("bidControlTmpl", bidControlTmpl);

                    $(".sortBodyL tr").not(".greyBg").remove();
                    $(".sortBodyR .controlWrap").remove();

                    $(".bidingCon").each(function () {
                        bidingArray.push($(this).find(".del-bid").attr("data-id"));
                    });
                    response.bidRecordIds = bidingArray;
                    $(".sortBodyL tbody").append($.tmpl("bidTemplate", response));
                    $(".sortBodyR").append($.tmpl("bidControlTmpl", response));

                    $(".template-dialog").modal('hide');

            }
            });
        } else {
            $(".errorTip").show();
        }
    });

    //模态框确定
    $(".sureBtn").click(function () {
        $(".errorTip").hide();
        var templateId;
        var flag = false;
        $(".templateTable").find('.radio-blue', this).each(function () {
            if ($(this).is(':visible')) {
                flag = true;
                templateId = $(this).siblings("input").val();
            }
        });
        if (flag) {
            $("#bidDialog").modal('hide');
            var packetId = $("#packetId").val();
            $.ajax({
                url: '/tender/setUpTenderTpl',
                data: {packetId: packetId, tplId: templateId},
                success: function (data) {
                    if (data.success) {
                        //保存成功后刷新页面
                        location.reload();
                    }
                }
            });
        } else {
            $(".errorTip").show();
        }
    });


    //没配置评分模板提示
    $(".export").hover(function () {
        $(".noTempFloatTip").show();
    }, function () {
        $(".noTempFloatTip").hide();
    });


    //模态框居中
    $('.modal').on('show.bs.modal', function () {
        var $this = $(this);
        var $modal_dialog = $this.find('.modal-dialog');
        $this.css('display', 'block');
        $this.find('.modal-dialog').css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2)});
    });


    //点击tab
    $(".tab").click(function () {
        $(this).removeClass("otherTab").addClass("currentTab").siblings(".tab").removeClass("currentTab").addClass("otherTab");
        var id = $(this).attr("id");
        if (id == "tab2") {
            $(".currentLine").animate({left: "138px", width: "120px"}, "normal");
            $("#resultTable1").hide();
            $("#resultTable2").show();
        } else {
            $(".currentLine").animate({left: "0", width: "133px"}, "normal");
            $("#resultTable2").hide();
            $("#resultTable1").show();
        }
    });

    //行悬停显示操作按钮
    $("#openBidTable tbody tr").hover(function () {
        $(this).find("button").show();
    }, function () {
        $(this).find("button").hide();
    });

    //应标
    $(document).on("click",".agree-bid",function(){
        if (checkStatus($("#tenderId").val())) {
            var bidRecordId = $(this).attr("data-id"),
                bidId = $(this).attr("data-bidid"),
                dataIndex=$(this).parents(".controlWrap").index(),
                projectId = $(this).attr("data-projectid");

            $('#btn-sure')
                .attr("data-Id", bidRecordId)
                .attr("data-bidId", bidId)
                .attr("data-index",dataIndex)
                .attr("data-projectId", projectId);
            $("#modalCompany").text($(this).attr("data-companyName"));

            $("#modalPrice").text($(this).attr("data-price")+"元/吨");

            $("#modalAmount").text((($(this).attr("data-supplyAmount"))*1/10000).toFixed(2)+"万吨");

            $("#withoutUnit").val((($(this).attr("data-supplyAmount"))*1/10000).toFixed(2));

            //根据id判断带回修改值
            $("#amount").val("");
            $(".bidingCon").each(function(){
                var dataId=$(this).find(".del-bid").attr("data-id"),
                    thisAmount=$(this).find(".amountVal").text();
                if(bidRecordId==dataId){
                    $("#amount").val(thisAmount);
                }
            });


            $(".commit-dialog").modal('show');
        } else {
            $(".error-dialog").modal('show');
        }

    });
    function totalAmount(){
        var totalAmount=0;
        $(".bidingCon").each(function(){
            totalAmount=totalAmount+(($(this).find(".amountVal").text()*1));
        });
        $(".totalNeedAmount").text(totalAmount.toFixed(2)+"万吨");
    }
    //应标确认
    $("#btn-sure").click(function () {
        $(".error-span").text("").hide();
        var amount = $("#amount").val(),
            tenderId = $("#tenderId").val(),
            bidId = $(this).attr("data-bidId"),
            bidRecordId = $(this).attr("data-Id"),
            dataIndex=$(this).attr("data-index"),
            withoutUnit=$("#withoutUnit").val()*1,
            projectId = $(this).attr("data-projectId");


        if (amount == "" || amount ==0) {
            $(".error-span").text("授予数量不得为空").show();
            return;
        }else if(amount>withoutUnit){
            $(".error-span").text("授予数量不能大于提报数量").show();
            return;
        } else {
            var reg = /^\d+(\.\d{0,2})?$/;
            if (!reg.test(amount)) {
                $(".error-span").text("请输入数字,限制在两位小数以内").show();
                return;
            }
        }
        $.ajax({
            url: '/account/handleAnswerBid/' + bidId,
            type: 'POST',
            data: {
                bidRecordId: bidRecordId,
                tenderId: tenderId,
                amount: amount,
                projectId: projectId
            },
            success: function (data) {

                var trName="<tr class='bidingCon'><td>"+data.bidCompanyName+"</td><td>"+data.winBidProjectId+"</td><td>"+data.winBidPrice+"</td><td class='amountVal'>"+((data.winBidAmount)*1/10000).toFixed(2)+"</td><td><a href='javascript:void(0)' class='a-bid del-bid' data-id='"+data.bidRecordId+"' data-bidId='"+data.bidId+"'>删除</a></td></tr>",
                    tdName="<td>"+data.bidCompanyName+"</td><td>"+data.winBidProjectId+"</td><td>"+data.winBidPrice+"</td><td class='amountVal'>"+((data.winBidAmount)*1/10000).toFixed(2)+"</td><td><a href='javascript:void(0)' class='a-bid del-bid' data-id='"+data.bidRecordId+"' data-bidId='"+data.bidId+"'>删除</a></td>",
                    once="";

                $(".commit-dialog").modal('hide');
                $(".controlWrap").eq(dataIndex-1).children("a").addClass("modifyBidBtn").text("修改");
                $("#amount").val("");
                if($(".bidingTableResult tr").length>1){
                    $(".bidingTableResult .bidingCon").each(function(){
                        var findDataId=$(this).find('.del-bid').attr("data-id");
                        if(findDataId==bidRecordId){
                            $(this).html(tdName);

                            once="haveSame";
                        }
                    });
                }
                if(once==""){
                    $(".bidingTableResult tbody").append(trName);
                }
                totalAmount();

            }
        });

    });
    $(".dialog-cancel").on("click",function(){
        $(".error-span").text("")
    });
    //删除操作
    $(document).on("click",".del-bid",function(){
        var bidRecordId=$(this).attr("data-id"),
            bidId=$(this).attr("data-bidid"),
            trIndex=$(this).parents("tr").index();
        $(".del-dialog").modal("show");
        $("#btn-del").attr("data-id",bidRecordId)
                     .attr("data-index",trIndex)
                     .attr("data-bidid",bidId);
    });
    //删除确定
    $("#btn-del").on("click",function(){
        var bidRecordId=$(this).attr("data-id"),
            tenderId=$("#tenderId").val(),
            dataIndex=$(this).attr("data-index"),
            bidId=$(this).attr("data-bidid");
        $.ajax({
            url: '/account/delAnswerBid/' + bidRecordId,
            type: 'POST',
            data: {
                tenderId:tenderId,
                bidId:bidId
            },
            success: function (response) {
                if(response=="success"){
                    $(".del-dialog").modal("hide");

                $(".bidingTableResult tr").eq(dataIndex).remove();
                    $(".controlWrap a").each(function(){
                        var dataId=$(this).attr("data-id");
                        if(dataId==bidRecordId){
                            $(this).removeClass("modifyBidBtn").text("应标");
                        }
                    })
                }
                totalAmount();
            }
        });
    });

    $(".resultBtn").click(function () {
        if (checkStatus($("#tenderId").val())) {
            $("#tipDialog").modal('show');
        } else {
            $(".error-dialog").modal('show');
        }
    });

    function submitTender() {
        var arr = [];

        $.each($("#resultTable1 tbody tr"), function () {
            var obj = new Object();
            obj.id = $(this).find(".trendId").attr("data-id");
            obj.needamount = $(this).find(".reduce_amout").attr("data-value");
            arr.push(obj);
        });

        var declareId = $("#declareId").val();

        $.ajax({
            url: '/tender/selectCommitMyTender/' + declareId,
            data: JSON.stringify(arr).replace(/"null"|'null'/g, null),
            contentType: 'application/json; charset=UTF-8',
            success: function (data) {
                if (data) {
                    location.href = '/account/mytender';
                } else {
                    alert("选标保存失败，请重试！");
                }

            }
        });
    }

    $("#modalSureBtn").click(function () {
        submitTender();
    });


});


//2016-08-30 add +++++++++++++++++++++++++++++++++

require(['jquery', 'bootstrap-sass'], function ($) {

    var answerBid = {
        "init": function () {
            this.hoverFun();
            this.selectFun();
        },
        "hoverFun": function () {
            var trIndex = "", divIndex = "";
            //hover效果
            $(".sortBodyL tr").not(".greyBg").hover(function () {
                trIndex = $(this).index();
                $(this).addClass("hoverBg");
                $(".sortBodyR div").eq(trIndex).addClass("hoverBg");
            }, function () {
                $(".sortBodyR div").eq(trIndex).removeClass("hoverBg");
                $(".sortBodyL tr").removeClass("hoverBg");
            });
            $(".sortBodyR div").not(".control").hover(function () {
                divIndex = $(this).index();
                $(this).addClass("hoverBg");
                $(".sortBodyL tr").eq(divIndex).addClass("hoverBg");
            }, function () {
                $(".sortBodyL tr").eq(divIndex).removeClass("hoverBg");
                $(".sortBodyR div").removeClass("hoverBg");
            });
        },
        "selectFun": function () {
            //评分排序功能
            var clickOnce=true;
            $(".sortHead").children("div").click(function () {

                $(".sortHead > div").removeClass("on");

                $(this).addClass("on");
                $("#goalTxt").text("评分排序");
                if ($(this).hasClass("goalSort")) {
                    if(clickOnce){
                        $(this).children("i").addClass("arrowDown");
                        $(".goalWrap").show();
                    }else{
                        $(this).children("i").removeClass("arrowDown");
                        $(".goalWrap").hide();
                    }
                    clickOnce=!clickOnce;
                } else {
                    clickOnce=true;
                    $(".sortHead > div").children("i").removeClass("arrowDown");
                    $(".goalWrap").hide();
                }

            });
            //点击列表


            $(".goalWrap a").click(function (e) {
                clickOnce=true;
                e.stopPropagation();
                $("#goalTxt").text($(this).text());
                $(".goalWrap").hide();
                $(".sortHead > div").children("i").removeClass("arrowDown");

            });

            //label选中
            $(".filterBlock label").on('click', function () {
                $(this).parents(".filterBlock").find("i").removeClass("selected");
                $(this).children("i").addClass("selected");
            });

            //排序
            var orderType='';

            var tenderId = $("#tenderId").val();
            var qualityIds='';
            function ajaxSort(){
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/account/loadAnswerBid/" + tenderId,
                    data: {projectId: $("#currentProjectId").val(),qualityIds:qualityIds,orderType:orderType},
                    success: function (response) {

                        if(response.bidList!=undefined || response.bidList.length>0){
                            //有搜索结果
                            var bidTmpl = $("#bidTmpl").html(),
                                bidControlTmpl=$("#bidControlTmpl").html();
                            var bidingArray=[];

                            $.template("bidTemplate", bidTmpl);
                            $.template("bidControlTmpl", bidControlTmpl);

                            $(".sortBodyL tr").not(".greyBg").remove();
                            $(".sortBodyR .controlWrap").remove();

                            $(".bidingCon").each(function(){
                                bidingArray.push($(this).find(".del-bid").attr("data-id"));
                            });
                            response.bidRecordIds=bidingArray;
                            $(".sortBodyL tbody").append($.tmpl("bidTemplate",response));
                            $(".sortBodyR").append($.tmpl("bidControlTmpl",response));
                            $(".control").removeClass("display-none");
                        }else{
                            //无搜索结果
                            $(".control").addClass("display-none");
                        }

                    }
                });
            }

            $(".filterBlock label").on("click",function(){
                var qualityStr=[];
                $(".filterBlock").each(function(){
                    if($(this).find(".selected").siblings("span.all").length<1){
                        qualityStr.push($(this).find(".selected").attr("data-quality"));
                    }
                });
                qualityIds=qualityStr.join(",");
                ajaxSort();

            });
            $(".mySort").on("click", function () {

                orderType=$(this).attr("data-sort");
                $("#btn-template").attr("data-sort",orderType);
                ajaxSort();

            });



        }
    }
    answerBid.init();
});