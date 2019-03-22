---
    layout: null
---

/**
 * 页面ready方法
 */
$(document).ready(function() {


    fnWriteToConsole()

    backToTop();
    search();
});


//function for show info in console
function fnWriteToConsole(){
    var sherlock = {};
    sherlock.info = {};
    sherlock.info.msg = [];
    sherlock.info.msgShow = []; 
    sherlock.info.msg.push('%c信　　仰：真相??');
    sherlock.info.msg.push('%c座 右 铭：∮逻辑的旋律牵动现象，永远演奏者事实♪');
    sherlock.info.msg.push('%c作　　者：leaf.fly');
    sherlock.info.msg.push('%c描　　述：qq:852800491;微信:13599545977;');
    sherlock.info.msg.push('%c邮　　箱：sherlock@bakerstreet.club');
    sherlock.info.msg.push('%c相关链接：bakerstreet.club,sherlock.help,bakerstreet.top,gogoogle.top');
    sherlock.info.msg.push('%c版 本 号：v1.0.0.20170708');
    sherlock.info.msg.push('%c❉ ');
    sherlock.info.msgShow.push('color:#7905C6');
    sherlock.info.msgShow.push('color:#089898');
    sherlock.info.msgShow.push('color:#030F05');
    sherlock.info.msgShow.push('color:#C4810A');
    sherlock.info.msgShow.push('color:#406239');
    sherlock.info.msgShow.push('color:#898321');
    sherlock.info.msgShow.push('color:#AA2E29');
    sherlock.info.msgShow.push('font-size:16pt');
    for(var i = 0; i < (sherlock.info.msg.length || 0); i++){
        console.log(sherlock.info.msg[i], (sherlock.info.msgShow[i] || 'color:red'));  
    }
}  


/**
 * 回到顶部
 */
function backToTop() {
    $("[data-toggle='tooltip']").tooltip();
    var st = $(".page-scrollTop");
    var $window = $(window);
    var topOffset;
    //滚页面才显示返回顶部
    $window.scroll(function() {
        var currnetTopOffset = $window.scrollTop();
        if (currnetTopOffset > 0 && topOffset > currnetTopOffset) {
            st.fadeIn(500);
        } else {
            st.fadeOut(500);
        }
        topOffset = currnetTopOffset;
    });

    //点击回到顶部
    st.click(function() {
        $("body").animate({
            scrollTop: "0"
        }, 500);
    });


}

function search(){
    (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
        (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
        e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.appendChild(s);
    })(window,document,'script','//s.swiftypecdn.com/install/v2/st.js','_st');

    _st('install','{{site.swiftype_searchId}}','2.0.0');
}
