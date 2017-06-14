require(['jquery'],function($) {


  //**********************************全选和行选择操作********************
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

  //**********************************全选和行选择操作******************

  //使用同一模板
  $(".useSame").click(function(){
    var tenderId= $("#declareId").val();
    $("#optMode").val("same");
    $(".noSelectTip").hide();
    var flag = false;
    $("#openBidTable").find('.tickBoxTd',this).each(function(){
      if($(this).is(':visible')){
        flag = true;
      }
    });
    if(!flag){
      $(".noSelectTip").show();
      return;
    }
    $.ajax({
      url: '/account/listAllTenderTpl',
      type:'POST',
      data:{tenderId:tenderId},
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
            html += "<td><a target='_blank' href='/account/myTenderTpl/detail/"+list[i].id+"'>"+list[i].tplName+"</a></td>";
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
});

  // 行内单独配置模板

  $(".opt").click(function(){
    $("#btn-template").data("packetId",$(this).data("value"));
    alterTempHtml($(this).data("value"));
    $("#optMode").val("sole");
  });

  function alterTempHtml(packetId){
    var tenderId= $("#declareId").val();
    $.ajax({
      url: '/account/listAllTenderTpl',
      type:'POST',
      data:{tenderId:tenderId,projectId:packetId},
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

  //模态框隐藏
  $(".dialog-cancel").on('click',function(){
    var type=$(this).data("type");
    $("."+type+"-dialog").modal('hide');
  });

  //模态框确定
  $("#btn-template").click(function(){
    var $this=$(this);
    if($(".radio-template.radio-blue").length>0){
      $(".errorTip").hide();
      var optMode = $("#optMode").val();
      if(optMode =="same") {
        //获取招标列表中被选择的行id
        var checkBoxArr = [];
        $("#openBidTable").find('.tickBoxTd', this).each(function () {
          if ($(this).is(':visible')) {
            checkBoxArr.push($(this).attr("data-value"));
          }
        });
        checkBoxArr = checkBoxArr.toString();
        var declareId = $("#declareId").val(),tenderId=$("#tenderId").val()
        $.ajax({
          url: '/account/setUpTenderTpls',
          type:'POST',
          data: {projectIds: checkBoxArr, tenderId: declareId, tplId: $(".radio-template.radio-blue").data("id")},
          success: function (data) {
            if(data=="success"){
              $(".template-dialog").modal('hide');
              location.reload();
            }
          }
        });
      }else{
        $.ajax({
          url: '/account/setUpTenderTpl',
          type:'POST',
          data: {projectId: $this.data("packetId"), tplId: $(".radio-template.radio-blue").data("id"), tenderId:$("#tenderId").val()},
          success: function (data) {
            if(data=="success"){
              $(".template-dialog").modal('hide');
              location.reload();
            }
          }
        });
      }
    }else{
      $(".errorTip").show();
    }
  });

  //模态框确定
  $(".sureBtn").click(function(){
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

      var optMode = $("#optMode").val();
      if(optMode =="same") {
        //获取招标列表中被选择的行id
        var checkBoxArr = [];
        $("#openBidTable").find('.tickBoxTd', this).each(function () {
          if ($(this).is(':visible')) {
            checkBoxArr.push($(this).attr("data-value"));
          }
        });
        checkBoxArr = checkBoxArr.toString();
        var declareId = $("#declareId").val();
        $.ajax({
          url: '/account/setUpTenderTpls',
          data: {projectIds: checkBoxArr, tenderId: declareId, tplId: templateId},
          success: function (data) {
            if(data=="success"){
              location.reload();
            }
          }
        });
      }else{

        var packetId = $("#packetId").val(),tenderId=$("#tenderId").val();
        $.ajax({
          url: '/tender/setUpTenderTpl',
          data: {packetId: packetId,tplId: templateId,tenderId:tenderId},
          success: function (data) {
            if(data.success){
              location.reload();
            }
          }
        });
      }
    }else{
      $(".errorTip").show();
      return;
    }
  });


//模态框居中
  $('.modal').on('show.bs.modal', function(){
    var $this = $(this);
    var $modal_dialog = $this.find('.modal-dialog');
    $this.css('display', 'block');
    $this.find('.modal-dialog').css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2) });
  });


});
