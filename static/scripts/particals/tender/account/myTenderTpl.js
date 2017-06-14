require(['jquery','bootstrap-sass','datePicker','common'],function($) {
    // $('#tplInfoModal').modal('show')
    var flag = false;
    $('#tplInfoBtn').on('click',function(){
        $('#tplInfoModal').modal('show');
    });

    var tenderTplList = {
        init : function() {
            this.delegate();
            $('#modalInfo_1').html('您确定删除该评标模板吗？');
        },
        "delegate": function () {
            var that = this;
            $(document).on("click", "[data-action]", function (e) {
                var $this = $(this), action = $this.data("action");
                e.stopPropagation();
                e.preventDefault();
                if (that[action]) {
                    that[action].call(that, $this);
                }
            });
        },
        "setDefault" : function(ele) {
            var id = $(ele).data("id");
            $.post("/account/setDefaultTpl", {tplId: id}, function(response){
                if (response) {
                    location.reload();
                }
            })
        },
        "delTpl" : function(ele) {
            var id = $(ele).data("id");
            $(".modal_1").modal();
            $("#md_ok_1").off().click(function(){
                $.post("/account/deleteTpl", {tplId: id}, function(response){
                    if (response == 'success') {
                        location.reload();
                    } else {
                        $("#failModal").modal();
                        setTimeout('$("#failModal").modal("hide")', 5000);
                    }
                });
            });
        }
    }
    tenderTplList.init();
});