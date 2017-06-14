require.config({
    baseUrl: "./",
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
        "bootstrap-sass": "bower_components/bootstrap-sass/assets/javascripts/bootstrap",
        jquery: "bower_components/jquery/dist/jquery",
        requirejs: "bower_components/requirejs/require",
        select2: "bower_components/select2/dist/js/select2",
        ueconfig: "app/scripts/plugins/ueditor/ueditor.config",
        ueall: "app/scripts/plugins/ueditor/ueditor.all",
        datePicker: "app/scripts/plugins/jQuery.fn.datePicker",
        common: "app/scripts//particals/common/common",
        respond: "bower_components/respond/dest/respond.src",
        validate: "bower_components/validate/validate",
        "jquery-validation": "bower_components/jquery-validation/dist/jquery.validate",
        "jquery-form": "bower_components/jquery-form/jquery.form",
        tmpl: "app/scripts/plugins/jquery.tmpl",
        uploadify:"app/scripts/plugins/uploadify/jquery.uploadify",
        simpleAjaxUpload: "app/scripts/plugins/SimpleAjaxUploader"
    }
});

require(['jquery','common','respond'],function($) {
    // 公共的只调用一次的方法

});