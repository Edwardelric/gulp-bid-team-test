require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    var tenderTplRel = {

        "isTplNameUnique" : false,
        "isTplNameChecked" : false,

        "init": function() {
            var $weightInput = $(".weightInput");

            if ( $("#tplRel").length !=0 ) {
                var that = this;
                $("#tplName").blur(function () {
                    var flag = that.validateTplName() && that.checkTplNameUnique();
                    if( flag ){
                        that.submitForm();
                    }
                });

                // show weight tip: how many weight have been used
                $weightInput.on("focus keyup", function () {
                    $(this).closest(".last").find(".weightTip").removeClass("vHidden");
                    //that.validateAmount()

                    //var result = that.validateTotalAmount();
                    var result = that.getTotalWeight();
                    if (result.total < 100) {
                        $(".usedTip").text(result.total + "%");
                        $(".leftTip").text(result.left + "%");
                        $(".lessTip").removeClass("none").siblings("p").addClass("none");
                    } else if (result.total > 100) {
                        $(".overTip").removeClass("none").siblings("p").addClass("none");
                    } else if (result.total == 100) {
                        $(".finishTip").removeClass("none").siblings("p").addClass("none");
                    }
                });

                // weightInput validation
                $weightInput.blur(function () {
                    var $this = $(this);
                    // hide tip
                    $this.closest("td").find(".weightTip").addClass("vHidden");
                    // toggle validateWeight error
                    that.validateWeight($this);
                });

                //$("#testBtn").click(function () {
                //  console.log("isTplNameChecked-" + that.isTplNameChecked + ":"  + "isTplNameUnique-" + that.isTplNameUnique);
                //});

                $("#saveTplBtn").click(function () {
                    that.submitForm();
                });

                // center modal
                $('#successModal, #tplInfoModal, #failModal').on('show.bs.modal', function () {
                    var $this = $(this);
                    var $modal_dialog = $this.find('.modal-dialog');
                    $this.css('display', 'block');
                    $this.find('.modal-dialog').css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2)});
                });

            }
        },

        "getTotalWeight": function() {
            var total = 0;
            $(".weightInput").each(function () {
                var weight = Number($(this).val());
                if (!isNaN(weight) && weight>=0 ) {
                    //console.log(weight);
                    total += weight;
                }
            });

            var left = 100 - total;
            return {total: total, left:left };
        },

        "validateTplName": function() {
            var tplName = $("#tplName").val();
            var flag = true;

            // 汉子、英文、数字
            var reg=/^[0-9a-zA-Z\u4e00-\u9fa5]*$/;

            // not null validation
            if ($.trim(tplName) == "") {
                flag = false;
            }
            if (tplName.length < 2 || tplName.length > 60) {
                flag = false;
            }

            if (!reg.test(tplName)) {
                flag = false;
            }

            if (flag == false) {
                $("#tplNameNull").show();
                $("#tplNameInfo").hide();
                $("#tplNameErr").hide();
                this.isTplNameUnique = false;
            }
            return flag;
        },

        "checkTplNameUnique": function() {
            var tplName = $("#tplName").val();
            var type = $("#type").val();
            var that = this, postData = {}, url = "";

            if (type == "release") {
                postData = {tplName: tplName};
                url = "/tenderTpl/IsExistsTplName";
            } else {
                postData = {tplName: tplName, tplId: $("#tplId").val()};
                url = "/tenderTpl/isTplNameExistsExclude";
            }

            // 校验是否重名
            $.ajax({
                global:false,
                url:url,
                method:'POST',
                data:postData,
                success:function(response){
                    if (response == 'success') {
                        $("#tplNameInfo").show();
                        $("#tplNameErr").hide();
                        $("#tplNameNull").hide();
                        that.isTplNameUnique = true;
                        that.isTplNameChecked = true;
                        return true;
                    } else {
                        $("#tplNameInfo").hide();
                        $("#tplNameNull").hide();
                        $("#tplNameErr").show();
                        that.isTplNameUnique = false;
                        that.isTplNameChecked = true;
                        return false;
                    }
                }
            })
            // $.post(url, postData, function(response) {
            //     if (response == 'success') {
            //         $("#tplNameInfo").show();
            //         $("#tplNameErr").hide();
            //         $("#tplNameNull").hide();
            //         that.isTplNameUnique = true;
            //         that.isTplNameChecked = true;
            //         return true;
            //     } else {
            //         $("#tplNameInfo").hide();
            //         $("#tplNameNull").hide();
            //         $("#tplNameErr").show();
            //         that.isTplNameUnique = false;
            //         that.isTplNameChecked = true;
            //         return false;
            //     }
            // });
        },

        "validateTplName4Submit" : function() {
            var tplName = $("#tplName").val();
            var that = this, flag = true;

            flag = flag && this.validateTplName();

            // not null validation
            if ($.trim(tplName) == "") {
                $("#tplNameNull").show();
                $("#tplNameInfo").hide();
                $("#tplNameErr").hide();
                that.isTplNameUnique = false;
                return false;
            }
            //console.log(that.isTplNameChecked + ":" + that.isTplNameUnique);
            if (that.isTplNameChecked && !that.isTplNameUnique) {
                return false;
            }
            return flag;
        },

        "validateWeight" : function($ele) {
            // 0-100 RegX
            var reg = /(^[1-9][0-9]$)|(^100$)|(^[0-9]$)$/;
            var flag = true;
            var weight = $.trim($ele.val());
            var $weightErr = $ele.closest(".last").find(".weightErr");

            // toggle validateWeight error
            if (!reg.test(weight)) {
                flag = false;
                $weightErr.removeClass("vHidden");
            }else {
                $weightErr.addClass("vHidden");
            }

            return flag;
        },

        "validateTotalWeight" : function() {
            var tflag = true, that = this, msg = "";

            // validate weightInput
            $(".weightInput").each(function(index, ele){
                tflag = tflag && that.validateWeight($(ele));
            });

            // total weight count validation
            var total = that.getTotalWeight().total;
            if (total > 100) {
                msg = "权重设置大于100%，请重新设置。";
                tflag = false;
            } else if ( total < 100) {
                msg = "权重设置小于100%，请重新设置。";
                tflag = false;
            }
            $(".summary p").text(msg);
            return tflag;
        },

        //"validateTotalAmount": function() {
        //  var total = 0, left = 0, flag = false, msg = "";
        //
        //  total = this.getTotalWeight();
        //
        //  if (total < 100) {
        //    flag = false;
        //    left = 100 - total;
        //    msg = "已配置" + total + "%的权重，还剩余" + left + "%的权重";
        //  } else if (total == 100) {
        //    flag = true;
        //    msg = "已配置100%权重";
        //  } else if (total > 100) {
        //    flag = false;
        //    msg = "您的配置超过100%权重，请再检查一下吧";
        //  }
        //  return {flag: flag, msg: msg, total: total, left: left};
        //},

        "submitForm" : function(){
            var url = "", flag = false, that = this;

            // type: release tpl or update tpl
            var type = $("#type").val();

            // validate Total Weight
            if (this.validateTotalWeight()) {
                flag =  true;
            }

            // validate tpl name
            flag = flag && this.validateTplName4Submit();

            if (flag) {
                // set post url
                if ( type == "release") {
                    url = "/account/releaseTenderTpl";
                } else if ( type == "preUpdate") {
                    url = "/account/updateTpl";
                }
                $.ajax({
                    global:false,
                    url:url,
                    method:'POST',
                    data:$("#tplForm").serialize(),
                    success:function(response){
                        if(response == 'success') {
                            $('#successModal .modal-header button').hide();
                            $('#md_cancel').hide();
                            $('#md_list').html('确认');
                            $("#successModal").modal();
                        }
                    }
                })
                // $.post(url, $("#tplForm").serialize(), function(response) {
                //     if(response == 'success') {
                //         $("#successModal").modal();
                //     }
                // } );
            }

        },
        "count": function() {
            var count = Number($("#count").text());
            if (count == 0) {
                clearInterval(timeCount);
                $("#failModal").modal("hide")
            }
            else {
                $("#count").text(--count);
            }
        }
    };
    tenderTplRel.init();
});