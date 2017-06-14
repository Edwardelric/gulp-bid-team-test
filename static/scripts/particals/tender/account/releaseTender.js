require(['jquery','simpleAjaxUpload','uploadify','bootstrap-sass','datePicker','common','jquery-form'],function($,ss,uploadify) {
    $(function () {
        var editData = null,
            isEdited = false;

        String.prototype.trim = function(){
            return this.replace(/(^\s*)|(\s*$)/g,'');        
        }; 
        (function(){
            // 判断是否是编辑状态
            if( $('#tenderJson').length ){
                $('#mask').show();
                $('#loading').show();
                editData = jQuery.parseJSON( $('#tenderJson').html() );
                isEdited = true;
            }
        })();

        (function(){
            $('#modalInfo_1').html('是否确认删除项目吗?');
        })();

        (function(){
            // 报价单位切换效果
            var txtRequired = $('#txtRequired'),
                quotePriceUnitTxt = $('#quotePriceUnitTxt input');
            quotePriceUnitTxt.on('change',function(){
                if( $(this).val()*1 == 2 ){
                    txtRequired.show();
                }else{
                    txtRequired.hide();
                }
            });
            quotePriceUnitTxt.eq(1).prop('checked',true);
        })();

        (function(){
            var margins = $('#margins'),
                marginPayModeErr = $('#marginPayModeErr');
            margins.on('blur',function(){
                if( !/^\s*$/.test( $(this).val() ) ){
                    marginPayModeErr.show();
                }else{
                    marginPayModeErr.hide();
                }
            });
            $('#tenderCommerce input[name=marginPayMode]').one('change',function(){
                $('#marginsStar').show();
            });
        })();

        (function(){
            var textarea = $('#bidRequirement,#rewardPenaltyTerms,#comments');
            var max = 1000;
            textarea.on('blur',function(){
                var len = $(this).val().length;
                if(len>max){
                    $(this).val( $(this).val().substr(0,1000));
                }else{
                    $(this).parent().find('.text-warning').html(max-len);
                }
            })
        })();

        var tenderStartDateVal = null;
        (function () {
            // 时间
            // 报价开始时间 和结束时间
            var timeArr = $('#tenderStartDate,#tenderEndDate,#startDate,#endDate');
            timeArr.slice(1).attr('disabled','disabled');
            var singleDay = 86400000;
            var date = new Date();

            timeArr.eq(0).on('focus',function(){
                WdatePicker({firstDayOfWeek:0,dateFmt:'yyyy-MM-dd HH:mm',position:{left:0,top:4},minDate:'%y-%M-%d',onpicked:timeFirst,autoPickDate:true});
            });
            function timeFirst(){
                timeArr.eq(1).removeAttr('disabled');
                timeArr.slice(1).val('');
            }
            function timeSecond(){
                timeArr.eq(2).removeAttr('disabled');
                timeArr.eq(2).val('');
                timeArr.eq(3).val('');
            }
            function timeThird(){
                timeArr.eq(3).removeAttr('disabled');
                timeArr.eq(3).val('');
            }
            timeArr.eq(1).on('focus',function(){
                var val = timeArr.eq(0).val();
                WdatePicker({firstDayOfWeek:0,dateFmt:'yyyy-MM-dd HH:mm',position:{left:0,top:4}, minDate:'#F{$dp.$D(\'tenderStartDate\',{m:10});}',onpicked:timeSecond,autoPickDate:true});
            });
            timeArr.eq(2).on('focus',function(){
                WdatePicker({firstDayOfWeek:0,dateFmt:'yyyy-MM-dd',position:{left:0,top:4},minDate:'#F{$dp.$D(\'tenderEndDate\',{d:1});}',maxDate:'#F{$dp.$D(\'endDate\',{d:-1});}',onpicked:timeThird,autoPickDate:true});
            });
            timeArr.eq(3).on('focus',function(){
                WdatePicker({firstDayOfWeek:0,dateFmt:'yyyy-MM-dd',position:{left:0,top:4},minDate:'#F{$dp.$D(\'startDate\',{d:1});}',autoPickDate:true});
            });
        })();

        (function(){
            $('#tenderTitle form').submit(function(){
                return false
            });
        })();

        var uploadData = [];
        if( isEdited && editData.tenderFilePath && editData.tenderFilePath.length>0 ){
            var tenderFile = editData.tenderFilePath;
            var str = '',editStr = '';
            for( var i=0,len = tenderFile.length;i<len;i++ ){
                str += '<li>'+ tenderFile[i].fileName+'</li>';
                editStr+= '<li>'+ tenderFile[i].fileName+'<span></span></li>';
            }
            $('#uploadData').append(str);
            $('#uploadList').append(editStr);
        }
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
                        showUploadErr.html("您的文件过大，请限制在"+maxSize+"M之内").css('display','inline-block');
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
                            showUploadErr.html('单个文件大小不能超过7M').css('display','inline-block');
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
                            showUploadErr.html('单个文件大小不能超过7M').show();
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

        // 标题,内容,商务条款,供应商设置对外暴露对象(分开设置,防止冲突)
        var titleData = {};
        var project = [];
        var commerceData = {};
        var supplyData = {};

        // 编辑状态
        if( isEdited ){
            // 标题
            titleData.tenderTitle = editData.tenderTitle;
            // 商务条款
            for( key in editData){
                if( key == 'tenderTitle' || key == 'project'){
                    continue;
                }else if( key == 'tenderFilePath'){
                    uploadData = editData.tenderFilePath;
                }else{
                    commerceData[key] = editData[key];
                }
                project = editData.project;
            }
        }
        (function(){
            var rulesJson = null;
            $.ajax({
                global:false,
                async:false,
                type:'GET',
                url:'/scripts/particals/tender/frontend/rules.json',
                success:function(response){
                    rulesJson = response;
                }
            });
            // 发布招标
            function Tender(args){
                this.index = args.index;
                this.contentId = $('#'+args.contentId);
                this.operateBtn = $('#'+args.operateBtn);
                this.btnId = $('#'+args.btnId);
                this.maxLen = args.maxLen;
                this.exportData = args.exportData;
                this.mask = $('#mask');
                this.init();
            }
            Tender.prototype.init = function(){
                this.projectNameArr = ['一','二','三','四','五','六','七','八','九','十'];
                this.isEdited = isEdited;
                this.editModel = this.contentId.find('.form-border');
                this.viewModel = this.contentId.find('.content-txt');
                this.saveBtn = this.contentId.find('.btn-blue');
                this.cancelBtn = this.contentId.find('.link-default');
                this.clickAddHandler();
                this.fireSaveHandler();
                this.fireCancelHandler();
                this.fireOperateHandler();
                if( isEdited ){
                    if( this.index == 0 ){
                        // 标题
                        for( key in this.exportData){
                            this.transmitVal(key,this.exportData[key]);
                        }
                        this.showHide(this.viewModel,true);
                        this.showHide(this.operateBtn,true);
                        this.showHide(this.btnId,false);
                    }else if( this.index == 1 ){
                        // 内容
                        var $template = null;
                        var transportModeList= ['不限','汽运','火运','船运'],
                            psList = [' -- ','原煤','末煤','混煤','三八块','洗精煤'];
                        for( var i=0,len=this.exportData.length;i<len;i++ ){
                            $template = this.contentId.find('.content-txt-template').clone();
                            $template.find('.project-name').html('项目'+this.projectNameArr[i]+':');
                            $template.removeClass('content-txt-template').addClass('content-txt content-txt-'+i)
                            $template.find('.edit:first').attr('data-index',i);
                            $template.find('.delete:first').attr('data-index',i);
                            this.btnId.parent().before($template);
                            $template.show();
                        }
                        this.editFlag = true;
                        for( var j=0,lens=this.exportData.length;j<lens;j++ ){
                            for( key in this.exportData[j] ){
                                this.editWhickIndex = j+'';
                                if( key == 'purchaseAmount' ){
                                    this.exportData[j]['purchaseAmount'] = this.exportData[j]['purchaseAmount']/10000;
                                }
                                if( key == 'transportMode'){
                                    this.exportData[j][key] = transportModeList.indexOf(this.exportData[j][key])+'';
                                }else if( key == 'PS'){
                                    this.exportData[j][key] = psList.indexOf(this.exportData[j][key])+'';
                                }
                                this.transmitVal(key,this.exportData[j][key]);
                            }
                        }
                        this.showHide(this.btnId,true);
                    }else if( this.index == 2 ){
                        // 商务条款
                        var marginArr = ['','在线缴纳','线下缴纳'];
                        for( key in this.exportData){
                            if( key == 'margins' ){
                                this.exportData['margins'] = this.exportData['margins']/10000;
                                $('#marginsStar').show();
                            }
                            if( key == 'marginPayMode' ){
                                this.exportData[key] += '';
                                this.transmitVal(key,this.exportData[key]*1);
                            }else{
                                this.transmitVal(key,this.exportData[key]);
                            }
                            if( key == 'rewardPenaltyTerms'){
                                $('#tenderCommerce .last-words').eq(1).html(1000-this.exportData[key].length);
                            }else if( key == 'comments' && this.exportData[key] ){
                                $('#tenderCommerce .last-words').eq(2).html(1000-this.exportData[key].length);
                            }else if( key == 'bidRequirement' && this.exportData[key] ){
                                $('#tenderCommerce .last-words').eq(0).html(1000-this.exportData[key].length);
                            }
                        }
                        this.showHide(this.viewModel,true);
                        this.showHide(this.operateBtn,true);
                        this.showHide(this.btnId,false);
                    }
                    $('#publish,#save').removeClass('disabled');
                }
            };
            Tender.prototype.clickAddHandler = function(){
                // 点击添加按钮
                var _self = this;
                this.btnId.on('click',function(){
                    if( _self.index == 1){
                        _self.editFlag = false;
                        // 添加煤炭指标
                        _self.exportData[_self.exportData.length] = {};
                        _self.editWhickIndex = _self.exportData.length-1;
                        $("body").addClass('no-scroll');
                    }
                    _self.clickAddCb();
                });
            };
            Tender.prototype.clickAddCb = function(){
                // 点击添加后
                //if( !this.editModel.find('input[name=tenderStartDate]').val() ){
                    //this.editModel.find('input[name=tenderStartDate]').val(tenderStartDateVal);
                //}else{
                    this.editModel.find('input[type=text]').val('');
                //}
                this.editModel.find('input[name=quotePriceUnit]').eq(1).prop('checked',true);
                $('#txtRequired').css('display','inline-block');
                this.editModel.find('select').val('0');
                this.editModel.find('.txt-warning').hide();
                if( this.index ==1 && this.exportData.length<=10){
                    var $template = this.contentId.find('.content-txt-template').clone();
                    var len = this.exportData.length-1;
                    $template.find('.project-name').html('项目'+this.projectNameArr[len]+':');
                    $template.removeClass('content-txt-template').addClass('content-txt content-txt-'+len)
                    $template.find('.edit:first').attr('data-index',len);
                    $template.find('.delete:first').attr('data-index',len);
                    this.btnId.parent().before($template);
                    this.editModel.find('.project-name').html('项目'+this.projectNameArr[len]);
                }
                this.showHide(this.editModel,true);
                if( this.index == 1) {
                    this.showHide(this.mask, true);
                }
                this.showHide(this.btnId,false);
                if( this.index == 2){
                    // 商务条款
                }
            };
            Tender.prototype.showHide = function(obj,flag){
                // 编辑/查看内容显示或影藏
                if( flag ){
                    obj.show();
                }else{
                    obj.hide();
                }
            };
            Tender.prototype.fireSaveHandler = function(){
                // 点击保存
                var _self = this;
                this.saveBtn.on('click',function(){
                    _self.validate();
                    return false;
                });
            };
            Tender.prototype.validate = function(){
                // 表单验证
                var validateKey = ['title','project','commerce','supply'];
                var validateContent = rulesJson[validateKey[this.index]];
                var rangeFront = null,rangeEnd = null,
                    validateObj = null,rangeTxt = null,
                    errorTxt = null,flag = true;
                var cbFlag = true;
                var _self = this;
                var len = null;
                var ncvTxt1 = this.editModel.find('[name=NCV]').val();
                var ncvTxt2 = this.editModel.find('[name=NCV2]').val();
                var ncvTxtParent = this.editModel.find('[name=NCV]').parent();
                for( key in validateContent ){
                    validateObj = validateContent[key];
                    rangeFront = this.editModel.find('[name='+key+']');
                    if( key == 'quotePriceUnit' || key == 'marginPayMode' ){
                        rangeTxt = rangeFront.filter(':checked').val();
                    }else{
                        rangeTxt = rangeFront.val();
                    }
                    errorTxt = rangeFront.parent().find('.txt-warning');
                    if( validateObj.label ){
                        // 有区间验证
                        if( rangeTxt && (!/^\s*$/.test( rangeTxt.trim() )) ){
                            // 前置或后置
                            rangeTxt = rangeTxt.trim();
                            cbFlag = validateRange(rangeFront,validateObj,validateContent,errorTxt);
                            if( cbFlag ){
                                successHandler(key,rangeTxt,this,validateObj);
                                errorTxt.hide();
                            }else{
                                flag = false;
                                errorTxt.removeAttr('style').show();
                            }
                        }else{
                            if( validateContent[key].gt ) {
                                // 后置为空
                                var gtVal = (this.editModel.find('[name=' + validateContent[key].gt + ']').val()).trim();
                                if ( gtVal ) {
                                    flag = false;
                                    errorTxt.removeAttr('style').html(validateContent[key].rulesError).show();
                                }
                            }else{
                                successHandler(key,rangeTxt,this,validateObj);
                                errorTxt.hide();
                            }
                        }
                    }else{
                        // 正则验证
                        if( rangeTxt && (!/^\s*$/.test( rangeTxt.trim() )) ){
                            rangeTxt = rangeTxt.trim();
                            validateObj = (validateObj.required=='true'?validateObj.rules:validateObj);
                            if( new RegExp(validateObj).test(rangeTxt) ){
                                successHandler(key,rangeTxt,this,validateObj);
                                errorTxt.hide();
                            }else{
                                flag = false;
                                errorTxt.removeAttr('style').html(validateContent[key].rulesError).show();
                            }
                            if( this.index == 2 ){
                                var startVal = $('#tenderStartDate').val();
                                var endVal = $('#tenderEndDate').val();
                                startVal = new Date(startVal).getTime();
                                endVal = new Date(endVal).getTime();
                                if( (key == 'tenderStartDate' || key == 'tenderEndDate') && startVal>endVal ){
                                    flag = false;
                                    errorTxt.removeAttr('style').html(validateContent[key].rulesError).show();
                                }
                            }
                        }else{
                            if( validateObj.required == 'true' || this.index == 0 ){
                                // 标题为空 必填项为空
                                flag = false;
                                errorTxt.removeAttr('style').html(validateObj.requiredError).show();
                            }else{
                                successHandler(key,rangeTxt,this,validateObj);
                                errorTxt.hide();
                            }
                        }
                    }
                }
                if( $('#quotePriceUnitTxt input:checked').val()*1 == 2 && this.index == 1){
                    // 元百大卡时热值必填
                    if( !ncvTxt1 || !ncvTxt2 || /^\s*$/.test( ncvTxt1.trim() ) || /^\s*$/.test( ncvTxt2.trim() ) ){
                        flag = false;
                        if( $('#quotePriceUnitTxt input:checked').val()*1 == 2 ){
                            ncvTxtParent.find('.txt-warning').html('低位热值不能为空').show();
                        }
                    }else{
                        if( ncvTxt1 && ncvTxt2 ){
                            if(  /^\d+$/.test(ncvTxt1) && /^\d+$/.test(ncvTxt2) && ncvTxt1*1<=ncvTxt2*1 && ncvTxt2*1<=7500 && ncvTxt1*1>=1){
                                ncvTxtParent.find('.txt-warning').hide();
                            }else{
                                flag = false;
                                ncvTxtParent.find('.txt-warning').html('请输入1-7500之间的整数(前置小于等于后置)').show();
                            }
                        }else{
                            ncvTxtParent.find('.txt-warning').hide();
                        }
                    }
                }
                if( this.index == 2){
                    // 保证金和缴纳方式判断
                    var marginPayModeError = $('#tenderCommerce input[name=marginPayMode]').parents('div:first').find('.txt-warning');
                    var marginsVal = $('#tenderCommerce input[name=margins]').val();
                    var marginsError = $('#margins').parent().find('.txt-warning');
                    var checkVal = $('#tenderCommerce input[name=marginPayMode]:checked').val();

                    if( marginsVal && /(^[1-9]\d{0,4}(\.\d{0,2})?$)|(^0(\.\d{0,2})?$)/.test(marginsVal) ){
                        if( !checkVal ){
                            marginPayModeError.removeAttr('style').show();
                            flag = false;
                        }else{
                            marginPayModeError.removeAttr('style').hide();
                        }
                    }else{
                        if( !marginsVal && checkVal){
                            marginsError.removeAttr('style').show();
                            flag = false;
                        }
                    }

                    // 上传文件必填
                    if( !uploadData.length ){
                        $('#showUploadErr').html('请选择文件').css('display','inline-block');
                        flag = false;
                    }
                }
                if( !flag ){
                    return false;
                }
                if( $.isEmptyObject(titleData) || !project.length || $.isEmptyObject(commerceData) || $('#tenderCommerce p.txt-warning:visible').length ){
                    $('#publish,#save').addClass('disabled');
                }else{
                    $('#publish,#save').removeClass('disabled');
                }
                this.showHide(this.editModel,false);

                if( this.index == 1) {
                    this.showHide(this.mask,false);
                }
                if( this.index != 1) {
                    this.showHide(this.viewModel, true);
                    this.showHide(this.btnId,false);
                    if( this.index == 2 ){
                        $('#uploadData').html( $('#uploadList').html() );
                    }
                }else{
                    len = this.editFlag?this.editWhickIndex*1:this.exportData.length-1;
                    this.showHide(this.contentId.find('.content-txt-'+len),true);
                    if( this.exportData.length >=10 ){
                        this.showHide(this.btnId, false);
                    }else {
                        this.showHide(this.btnId, true);
                    }
                }
                $('#submitErr').hide();
                $("body").removeClass('no-scroll');
                function validateRange(rangeFront,validateObj,validateContent,errorTxt){
                    // 验证区间
                    var val = null;;
                    var rangeFrontVal = null;
                    var reg = (validateObj.dataType == 'integer')?/^\d+$/:/^\d+(\.\d{1,2})?$/;
                    if( validateObj.related ){
                        // 前置输入框
                        val = _self.editModel.find('[name='+validateObj.related+']').val();
                        rangeFrontVal = rangeFront.val();

                        if( rangeFrontVal && val ){
                            rangeFrontVal = rangeFrontVal.trim();
                            val = val.trim();
                            if( /^\d+(\.\d{1,2})?$/.test(rangeFrontVal) && /^\d+(\.\d{1,2})?$/.test(val) ){
                                rangeFrontVal*=1;
                                val*=1;
                            }else{
                                errorTxt.html(validateObj.rulesError).show();
                                return false;
                            }
                            if( rangeFrontVal>= validateObj.min*1 && rangeFrontVal<= validateObj.max*1
                                &&  val>= validateObj.min*1 && val*1<= validateObj.max*1
                                && rangeFrontVal<=val && reg.test(rangeFrontVal) && reg.test(val)
                            ){
                                return true;
                            }else{
                                errorTxt.html(validateObj.rulesError).show();
                                return false;
                            }
                        }else{
                            errorTxt.html(validateObj.requiredError).show();
                            return false;
                        }
                    }else{
                        // 后置输入框
                        rangeFrontVal = _self.editModel.find('[name='+validateObj.gt+']').val();
                        val = rangeFront.val();

                        if( rangeFrontVal && val ){
                            rangeFrontVal = rangeFrontVal.trim();
                            val = val.trim();
                            if( /^\d+(\.\d{1,2})?$/.test(rangeFrontVal) && /^\d+(\.\d{1,2})?$/.test(val) ){
                                rangeFrontVal*=1;
                                val*=1;
                            }else{
                                errorTxt.html(validateObj.rulesError).show();
                                return false;
                            }
                            if( rangeFrontVal>= validateContent[validateObj.gt].min*1 && rangeFrontVal<= validateContent[validateObj.gt].max*1
                                    &&  val>= validateContent[validateObj.gt].min*1 && val*1<= validateContent[validateObj.gt].max*1
                                    && rangeFrontVal<=val && reg.test(rangeFrontVal) && reg.test(val)
                                ){
                                    return true;
                            }else{
                                errorTxt.html(validateObj.rulesError).show();
                                return false;
                            }
                        }else{
                            errorTxt.html(validateObj.requiredError).show();
                            return false;
                        }
                    }
                    //var dataType = validateObj.related;
                }
                function successHandler(key,val,_self,validateObj){
                    var len = _self.editFlag?_self.editWhickIndex*1:_self.exportData.length-1;
                    // 验证成功(每成功一个赋值)
                    if( _self.index == 1){
                        _self.exportData[len][key] = val;
                    }else{
                        _self.exportData[key] = val;
                        _self.showHide(_self.operateBtn,true);
                    }
                    _self.transmitVal(key,val,validateObj);
                }
            };
            Tender.prototype.transmitVal = function(key,val,validateObj){
                // 查看页面的时候赋值
                var arr = [
                    ['不限','汽运','火运','船运'],
                    ['','元/吨','元/百大卡·吨'],
                    ['','在线缴纳','线下缴纳'],
                    [' -- ','原煤','末煤','混煤','三八块','洗精煤']
                ];
                var len = null;
                var strTxt = null;
                if( this.index != 1){
                    strTxt = this.viewModel.find('.'+key);
                }else{
                    len = this.editFlag?this.editWhickIndex*1:this.exportData.length-1;
                    strTxt = this.contentId.find('.content-txt-'+len);
                    strTxt = strTxt.find('.'+key);
                }
                if( val && !/^\s*$/.test(val) ){
                    if( key=='purchaseAmount' ){
                        strTxt.html(val+'万吨');
                    }else if( key == 'margins' ){
                        strTxt.html(val+'万元');
                    }else if( ['transportMode','quotePriceUnit','marginPayMode','PS'].indexOf(key)>-1 ){
                        var index = ['transportMode','quotePriceUnit','marginPayMode','PS'].indexOf(key);
                        if( isEdited ){
                            strTxt.html(arr[index][val*1]);
                        }else{
                            strTxt.html(arr[index][val*1]);
                        }
                    }else{
                        // 判断是否为后置的输入框
                        if( /^.*2$/.test(key) ){
                            if( key == 'NCV2'){
                                strTxt.html(val+' kcal/kg ');
                            }else if( key == 'AFT2'){
                                strTxt.html(val+' ℃');
                            }else{
                                strTxt.html(val+'%');
                            }
                        }else if( key == 'contractEndDate'){
                            strTxt.html(' 至 '+val);
                        }else if( this.index==1 && ['receiptUnitName','receiptAddress','coalStr','origin'].indexOf(key)<0 ){
                            strTxt.html(val+' - ');
                        }else{
                            strTxt.html(val);
                        }
                    }
                }else{
                    if(!validateObj.gt && key != 'contractEndDate'){
                        strTxt.html('--');
                    }
                }
                setTimeout(function(){
                    $(window).trigger('resize');
                },500);
            };
            Tender.prototype.fireCancelHandler = function(){
                // 点击取消
                var _self = this;
                this.cancelBtn.on('click',function(){
                    _self.editModel.hide();
                    _self.showHide(_self.mask,false);
                    if(_self.index != 1 ) {
                        if (_self.exportData.settlementMode) {
                            _self.viewModel.show();
                            _self.btnId.hide();
                        } else {
                            if( _self.exportData.tenderTitle ){
                                _self.viewModel.show();
                                _self.btnId.hide();
                            }else{
                                _self.viewModel.hide();
                                _self.btnId.show();
                            }
                        }
                    }else{
                        var len = _self.editFlag?_self.editWhickIndex*1:_self.exportData.length-1;
                        if( _self.exportData[len].receiptUnitName ){
                            _self.contentId.find('.content-txt-'+len).show();
                        }else{
                            _self.contentId.find('.content-txt-'+len).remove();
                            _self.exportData.splice(len,1);
                        }
                        _self.btnId.show();
                    }
                    $("body").removeClass('no-scroll');

                    function checkCommerceData(){
                        var arrKey = ['settlementMode','tenderStartDate','contractEndDate','rewardPenaltyTerms'];
                        var flag = true;
                        for( key in arrKey ){
                            if(  !commerceData[arrKey[key]] ){
                                return false;
                            }
                        }
                        if( commerceData.margins && !commerceData.marginPayMode ){
                            return false;
                        }else if( !commerceData.margins && commerceData.marginPayMode){
                            return false;
                        }
                        if( !uploadData.length ){
                            return false;
                        }
                        return true;
                    }

                    if( titleData.tenderTitle && ( project.length>0 && project[0].receiptUnitName) && checkCommerceData() ){
                        $('#publish,#save').removeClass('disabled');
                    }else{
                        $('#publish,#save').addClass('disabled');
                    }
                });
            };
            Tender.prototype.fireOperateHandler = function(){
                var _self = this;
                this.operateBtn.on('click',function(event){
                    if( $(event.target).hasClass('edit') ){
                        // 编辑
                        $('#publish,#save').addClass('disabled');
                        var inputObj = null,
                            val = null;
                        for( key in _self.exportData ){
                            inputObj = _self.editModel.find('[name='+key+']');
                            val = _self.exportData[key];
                            if( key == 'marginPayMode'){
                                if( !val ){
                                    break;
                                }
                                if(val*1==1){
                                    inputObj.eq(0).prop('checked',true);
                                }else{
                                    inputObj.eq(1).prop('checked',true);
                                }
                            }else{
                                inputObj.val(val);
                            }
                        }
                        _self.showHide(_self.editModel,true);
                        if( _self.index == 1) {
                            _self.showHide(_self.mask, true);
                        }
                        _self.showHide(_self.viewModel,false);
                    }
                });
                if( this.index == 1){
                    // 编辑项目
                    this.contentId.on('click','.edit',function(){
                        $('#publish,#save').addClass('disabled');
                        var projectIndex = $(this).attr('data-index')*1;
                        var input = null,
                            val = null;

                        _self.editModel.find('input[type=text]').val('');
                        _self.editModel.find('select').val('0');
                        _self.editWhickIndex = projectIndex*1;
                        _self.editFlag = true;

                        _self.editModel.find('.project-name').html('项目'+_self.projectNameArr[projectIndex]);
                        for(key in _self.exportData[projectIndex*1]){
                            inputObj = _self.editModel.find('[name='+key+']');
                            val = _self.exportData[projectIndex][key];
                            if( key == 'quotePriceUnit'){
                                if(val*1==1){
                                    inputObj.eq(0).prop('checked',true);
                                }else{
                                    inputObj.eq(1).prop('checked',true);
                                }
                            }else if(key == 'transportMode'){
                                inputObj.val(val);
                            }else if(key == 'PS'){
                                inputObj.val(val);
                            }else{
                                inputObj.val(val);
                            }
                        }
                        _self.showHide(_self.editModel,true);
                        if( _self.index == 1) {
                            _self.showHide(_self.mask, true);
                        }
                        _self.showHide(_self.contentId.find('.content-txt-'+projectIndex),false);
                        _self.showHide(_self.btnId,false);
                    });
                    var removeIndex = null;
                    this.contentId.on('click','.delete',function(){
                        var projectIndex = $(this).attr('data-index');
                        removeIndex = projectIndex;
                        $('.modal_1').modal('show');
                    });
                    // 删除功能
                    $('#md_ok_1').on('click',function(){
                        _self.exportData.splice(removeIndex,1);
                        if( titleData.tenderTitle && ( project.length>0 && project[0].receiptUnitName) && commerceData.settlementMode ){
                            $('#publish,#save').removeClass('disabled');
                        }else{
                            $('#publish,#save').addClass('disabled');
                        }
                        _self.showHide(_self.btnId,true);
                        $('#tenderProject .content-txt-'+removeIndex).remove();
                        for(var i=removeIndex*1+1;i<10;i++){
                            var content = $('#tenderProject .content-txt-'+i);
                            if( content.length>0 ){
                                content.removeClass('content-txt-'+i).addClass('content-txt-'+(i-1));
                                content.find('.project-name').html('项目'+_self.projectNameArr[i-1]+':');
                                content.find('.edit').attr('data-index',i-1);
                                content.find('.delete').attr('data-index',i-1);
                            }
                        }
                        $('.modal_1').modal('hide');
                    });
                }
            }
            // 标题
            new Tender({
                contentId:'tenderTitle',
                btnId:'addTitleBtn',
                operateBtn:'titleOperateBtn',
                maxLen:1,
                exportData:titleData,
                index:0
            });
            // 内容
            new Tender({
                contentId:'tenderProject',
                btnId:'addProjectBtn',
                operateBtn:'projectOperateBtn',
                maxLen:10,
                exportData:project,
                index:1
            });
            // 商务条款
            new Tender({
                contentId:'tenderCommerce',
                btnId:'addCommerceBtn',
                operateBtn:'commerceOperateBtn',
                maxLen:1,
                exportData:commerceData,
                index:2
            });
        })();

        (function(){
            if( isEdited ){
                setTimeout(function(){
                    $('#mask').hide();
                    $('#loading').hide();
                },800);
            }
        })();

        (function(){
            var publish = $('#publish'),
                save = $('#save');
            var saveData = {},
                template = {},flag = false;
            var transportModeArr = ['不限','汽运','火运','船运'];
            var psArr = ['','原煤','末煤','混煤','三八块','洗精煤'];
            var submitErr = $('#submitErr');
            var url = null,saveUrl = null;
            if( isEdited ){
                url = '/tender/updateForRealRelease';
                saveUrl  = '/tender/updateForTempSave';
                var lastIndex = window.location.href.lastIndexOf('/');
                saveData.id = window.location.href.substr(lastIndex);
                saveData.id = saveData.id.replace(/[^\d]/g,'');
            }else{
                url = '/tender/releaseTender';
                saveUrl  = '/tender/tempSaveTender';
            }
            publish.on('click',function(){
                if( submitHandler() ){
                    submitErr.hide();
                    $('#publish,#save').removeClass('disabled');
                    if( saveData.marginPayMode && saveData.marginPayMode*1 == 1 ){
                        $.ajax({
                            url:'/validateCashAccount',
                            type:'GET',
                            success:function(response){
                                if( response == 'success' ){
                                    publishHanlder();
                                }else if( response == 'NoCashAccount'){
                                    $(".modal_binding").modal("show");
                                    $("#goBinding").click(function(){
                                        window.open($('#publish').attr('data-funding-account'));
                                    })
                                }else{
                                    $(".modal_2").modal("show");
                                    $("#modalInfo_2").text("您的资金账户已冻结，请联系技术人员");
                                    $("#md_ok_2").on("click",function(){$(".modal_2").modal("hide")})
                                }
                            }
                        })
                    }else{
                        publishHanlder();
                    }
                }else{
                    submitErr.show();
                    return false;
                }
                function publishHanlder(){
                    $.ajax({
                        url:url,
                        type:'POST',
                        contentType: "application/json; charset=utf-8",
                        data:JSON.stringify(saveData),
                        success:function(response){
                            $('#modalImg_5').addClass('yes');
                            $('#modalInfo_5').text('发布招标成功');
                            $('#modal_html_5').html('<a href="/account/myTender" class="btn btn-blue">跳转至我的招标</a>');
                            $('.modal_5').modal('show');
                        }
                    });
                }
            });
            save.on('click',function(){
                if( submitHandler() ){
                    submitErr.hide();
                    $('#publish,#save').removeClass('disabled');
                    if( saveData.marginPayMode && saveData.marginPayMode*1 == 1 ){
                        $.ajax({
                            url: '/validateCashAccount',
                            type: 'GET',
                            success: function (response) {
                                if (response == 'success') {
                                    saveHandler()
                                }else if( response == 'NoCashAccount'){
                                    $(".modal_binding").modal("show");
                                    $("#goBinding").click(function(){
                                        window.open($('#save').attr('data-funding-account'));
                                    })
                                }else{
                                    $(".modal_2").modal("show");
                                    $("#modalInfo_2").text("您的资金账户已冻结，请联系技术人员");
                                    $("#md_ok_2").on("click",function(){$(".modal_2").modal("hide")})
                                }
                            }
                        });
                    }else{
                        saveHandler()
                    }
                }else{
                    submitErr.show();
                    return false;
                }
                function saveHandler(){
                    $.ajax({
                        url:saveUrl,
                        method:'POST',
                        contentType: "application/json; charset=utf-8",
                        data:JSON.stringify(saveData),
                        success:function(response){
                            $('#modalImg_5').addClass('yes');
                            $('#modalInfo_5').text('保存招标成功');
                            $('#modal_html_5').html('<a href="/account/tenderDraft" class="btn btn-blue">跳转至待发布项目</a>');
                            $('.modal_5').modal('show');
                        }
                    })
                }
            });
            function submitHandler(){
                var flag = true;
                // 标题未填写
                if( !titleData.tenderTitle ){
                    submitErr.show();
                    return false;
                }
                for( key in titleData ){
                    if( titleData[key] ) {
                        saveData[key] = titleData[key];
                    }else{
                        submitErr.show();
                        return false;
                    }
                }
                // 项目一未填写
                saveData.project = [];
                if( !project.length ){
                    submitErr.show();
                    return false;
                }
                for( var i=0,len=project.length;i<len;i++){
                    temp = {};
                    flag = false;
                    for( key in project[i]){
                        if( project[i][key] ){
                            flag = true;
                            if( key == 'transportMode'){
                                temp[key] = transportModeArr[project[i][key]*1];
                            }else if( key == 'PS'){
                                if( project[i][key]*1 ){
                                    temp[key] = psArr[project[i][key]];
                                }
                            }else{
                                temp[key] = project[i][key];
                            }
                        }
                    }
                    if( flag ){
                        saveData.project[i] = $.extend({},temp);
                        saveData.project[i].id = i+1;
                    }
                }
                var commerceDataFlag = false;
                // 商务条款未填写
                for( key in commerceData ){
                    if( commerceData[key] && !/^\s$/.test(commerceData[key]) ){
                        saveData[key] = commerceData[key];
                        commerceDataFlag = true;
                    }
                }
                if( !commerceDataFlag && !uploadData.length){
                    submitErr.show();
                    return false;
                }
                // 上传的图片
                var uploadDataArr = [];
                if( uploadData.length ){
                    saveData.tenderFilePath = [];
                    for( var i=0;i<uploadData.length;i++){
                        if( uploadData[i].fileName ){
                            saveData.tenderFilePath.push(uploadData[i]);
                        }
                    }
                }
                return true;
            }
        })();
    })
});