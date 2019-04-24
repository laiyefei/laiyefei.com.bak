$('body').show();
$('.version').text(NProgress.version);
NProgress.start();
setTimeout(function() {
	NProgress.done();
	$('.fade').removeClass('out')
}, 1000);
(function() {
	$('img').attr('draggable', 'false');
	$('a').attr('draggable', 'false')
})();


function tagDoAutoHide(id, ele, times){

	$("#ulTagWall a span").css({
		"font-weight" : "normal",
		"background-color" : "#eee",
        "font-size": "12px"
	});

	$(ele).find("span").css({
		"font-weight" : "bold",
		"background-color" : "#0080004a",
		"font-size": "16px"
	});

	$('.list_hook_title').hide();
	$(".list_hook_title_show").css({
		"font-weight" : "normal"
	});

	$('#'+ id).show();
	$("#show_" + id).css({
		"font-weight" : "bold"
	});
	var times = $(ele).attr("times");
	times = parseInt(times);
	if(times <= 1){
		var $ele = $(ele);
		$ele.attr("times", ++times);
		(function($ele){
			setTimeout(function(){
				$ele[0].click();
			}, 300);
		})($ele);
	} 
}

function elementAutoHide(element){
	$(".list_hook_title").hide();
	$(".list_hook_title_show").css({
		"font-weight" : "normal"
	});
	//csTitleContent	
	var headerTopbar = $('.header-topbar');
	var fixEle = $('.fixed');
	var top = element.position().top,
	pos = element.css("position");
	var scrolls = $(this).scrollTop();
	if (scrolls > top) {
		headerTopbar.fadeOut(0);
		if (window.XMLHttpRequest) {
			element.css({
				position: "fixed",
				top: 0
			}).addClass("shadow");
			fixEle.css({
				'position': 'fixed',
				'top': '70px',
				'width': '360px'
			});
			var href = decodeURIComponent(window.location.href);
			var hrefParams = href.split("#");
			if(0 < hrefParams.length){
				$('#' + hrefParams[1]).show();
				$("#show_" + hrefParams[1]).css({
					"font-weight" : "bold"
				});
			}
		} else {
			element.css({
				top: scrolls
			});
		}
	} else {
		headerTopbar.fadeIn(500);
		element.css({
			position: pos,
			top: top
		}).removeClass("shadow");
		fixEle.removeAttr("style");
		$("#ulTagWall a").attr("times", "1");
	}
}

function setCookie(name, value, time) {
	var strsec = getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec * 1);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
}
function getsec(str) {
	var str1 = str.substring(1, str.length) * 1;
	var str2 = str.substring(0, 1);
	if (str2 == "s") {
		return str1 * 1000
	} else if (str2 == "h") {
		return str1 * 60 * 60 * 1000
	} else if (str2 == "d") {
		return str1 * 24 * 60 * 60 * 1000
	}
}
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2])
	} else {
		return null
	}
}
$.fn.navSmartFloat = function() {
	var position = function(element) {
			var top = element.position().top,
				pos = element.css("position");
			$(window).scroll(function() {
				var scrolls = $(this).scrollTop();
				if (scrolls > top) {
					$('.header-topbar').fadeOut(0);
					if (window.XMLHttpRequest) {
						element.css({
							position: "fixed",
							top: 0
						}).addClass("shadow");
						$('.fixed').css({
							'position': 'fixed',
							'top': '70px',
							'width': '360px'
						});
						$(".csTitleContent").addClass("csTitleContentFixed");
					} else {
						element.css({
							top: scrolls
						});
					}
				} else {
					$('.header-topbar').fadeIn(500);
					element.css({
						position: pos,
						top: top
					}).removeClass("shadow");
					$('.fixed').removeAttr("style");
					$(".csTitleContent").removeClass("csTitleContentFixed");
					$("#ulTagWall a").attr("times", "1");
					$(".list_hook_title").hide();
					$(".list_hook_title_show").css({
						"font-weight" : "normal"
					});
				}
			})
		};
	return $(this).each(function() {
		position($(this))
	})
};
$("#navbar").navSmartFloat();
$("#gotop").hide();
$(window).scroll(function() {
	if ($(window).scrollTop() > 100) {
		$("#gotop").fadeIn()
	} else {
		$("#gotop").fadeOut()
	}
});
$("#gotop").click(function() {
	$('html,body').animate({
		'scrollTop': 0
	}, 500)
});
// $("img.thumb").lazyload({
// 	placeholder: "/assets/img/base/occupying.png",
// 	effect: "fadeIn"
// });
// $(".single .content img").lazyload({
// 	placeholder: "/assets/img/base/occupying.png",
// 	effect: "fadeIn"
// });
$('[data-toggle="tooltip"]').tooltip();
jQuery.ias({
	history: false,
	container: '.content',
	item: '.excerpt',
	pagination: '.pagination',
	next: '.next-page a',
	trigger: '查看更多',
	loader: '<div class="pagination-loading"><img src="/assets/img/base/loading.gif" /></div>',
	triggerPageThreshold: 5,
	onRenderComplete: function() {
		// $('.excerpt .thumb').lazyload({
		// 	placeholder: '/assets/img/base/occupying.png',
		// 	threshold: 400
		// });
		$('.excerpt img').attr('draggable', 'false');
		$('.excerpt a').attr('draggable', 'false')
	}
});
// $(window).scroll(function() {
// 	var sidebar = $('.sidebar');
// 	var sidebarHeight = sidebar.height();
// 	var windowScrollTop = $(window).scrollTop();
// 	if (windowScrollTop > sidebarHeight - 60 && sidebar.length) {
// 		$('.fixed').css({
// 			'position': 'fixed',
// 			'top': '70px',
// 			'width': '360px'
// 		})
// 	} else {
// 		$('.fixed').removeAttr("style")
// 	}
// });
// (function() {
// 	var oMenu = document.getElementById("rightClickMenu");
// 	var aLi = oMenu.getElementsByTagName("li");
// 	for (i = 0; i < aLi.length; i++) {
// 		aLi[i].onmouseover = function() {
// 			$(this).addClass('rightClickMenuActive');
// 		};
// 		aLi[i].onmouseout = function() {
// 			$(this).removeClass('rightClickMenuActive');
// 		}
// 	}
// 	document.oncontextmenu = function(event) {
// 		$(oMenu).fadeOut(0);
// 		var event = event || window.event;
// 		var style = oMenu.style;
// 		$(oMenu).fadeIn(300);
// 		style.top = event.clientY + "px";
// 		style.left = event.clientX + "px";
// 		return false
// 	};
// 	document.onclick = function() {
// 		$(oMenu).fadeOut(100);
// 	}
// })();
// document.onkeydown = function(event) {
// 	var e = event || window.event || arguments.callee.caller.arguments[0];
// 	if (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 13) return true;
// 	if ((e.keyCode === 123) || (e.ctrlKey) || (e.ctrlKey) && (e.keyCode === 85)) {
// 		return false
// 	}
// };
// try {
// 	if (window.console && window.console.log) {
// 		console.log("\n欢迎访问站长素材！\n\n");
// 		console.log("\n请记住我们的网址：%c sc.chinaz.com", "color:red")
// 	}
// } catch (e) {};

function SiteSearch(send_url, divTgs) {
	var str = $.trim($(divTgs).val());
	if (str.length > 0 && str != "请输入关键字") {
		str = str.replace(/\s+/g, "");
		str = str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\，|\。|\：|\；|\·|\~|\！|\、|\《|\》|\‘|\“|\”|\【|\】|\?{|\}|\-|\=|\——|\+|\’|\—|\？]/g, "");
		str = str.replace(/<[^>]*>|/g, "");
		window.location.href = send_url + "?keyword=" + encodeURI(str)
	}
	return false
}

//init respose show
;(function() {
	elementAutoHide($("#navbar")); 
})();