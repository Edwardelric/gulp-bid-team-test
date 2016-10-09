require.config({
    // baseUrl: "../../src-web/app/scripts",
    shim: {
        "bootstrap-sass": {
            deps: [
                "jquery"
            ]
        },
        common: {
            deps: [
                "jquery"
            ]
        },
        select2: {
            deps: [
                "jquery"
            ]
        },
        datePicker: {
            deps: [
                "jquery"
            ]
        },
        "jquery-form": {
            deps: [
                "jquery"
            ]
        },
        validate: {
            deps: [
                "jquery"
            ]
        },
        tmpl: {
            deps: [
                "jquery"
            ]
        },
        uploadify:{
            deps:[
                "jquery"
            ]
        },
        simpleAjaxUpload: {
            deps: [
                "jquery"
            ]
        }
    },
    packages: [

    ],
    paths: {
        "bootstrap-sass": "../../src-web/bower_components/bootstrap-sass/assets/javascripts/bootstrap",
        jquery: "../../src-web/bower_components/jquery/dist/jquery",
        requirejs: "../../src-web/bower_components/requirejs/require",
        select2: "../../src-web/bower_components/select2/dist/js/select2",
        ueconfig: "../../src-web/plugins/ueditor/ueditor.config",
        ueall: "../../src-web/plugins/ueditor/ueditor.all",
        datePicker: "../../src-web/app/scripts/plugins/jQuery.fn.datePicker",
        common: "../../src-web/app/scripts//particals/common/common",
        respond: "../../src-web/bower_components/respond/dest/respond.src",
        validate: "../../src-web/bower_components/validate/validate",
        "jquery-validation": "../../src-web/bower_components/jquery-validation/dist/jquery.validate",
        "jquery-form": "../../src-web/bower_components/jquery-form/jquery.form",
        tmpl: "../../src-web/app/scripts/plugins/jquery.tmpl",
        uploadify:"../../src-web/app/scripts/plugins/uploadify/jquery.uploadify",
        simpleAjaxUpload: "../../src-web/app/scripts/plugins/SimpleAjaxUploader"
    }
});

require(['jquery','common','respond'],function($) {
    // 公共的只调用一次的方法

});