$(function(){
    var b = 10;
    var a = 20;
    for (var i = 0; i < 10; i++) {
        b = i;
    }
    function cb(b) {
        a = b;
    }
    cb(b);
    bb();
    if (a===b) {
        b = true;
    }
    function bb(){
        a = Math.random();
        document.title = a;
    }
    for(var j=0;j<20;j++){
        a = bb();
    }
    console.log(b);
});