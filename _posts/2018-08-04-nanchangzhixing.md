---
layout: postWithIframe
title: 南昌之行
tags: 旅行
categories: 旅行
date: 2018-08-04
---

* TOC
{:toc}

# 南昌之行

<!--[if lte IE 8]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<link rel="stylesheet" href="/static/css/biz/style.css" type="text/css" media="screen" />

<!--必要样式表-->
<link rel="stylesheet" href="/static/css/biz/index.css" type="text/css" media="screen" />
<link rel="stylesheet" href="/static/css/biz/adapt.css" type="text/css" media="screen" />

<script type="text/javascript" src="/static/js/biz/jquery.min.js"></script>
<script type="text/javascript" src="/static/js/biz/flux.js"></script>
<script type="text/javascript">

var oImgExports = [
	"这么有诗意的吗？",
	"葛优躺",
	"夕阳",
	"假装一下",
	"盘旋的大雁",
	"妖艳喷泉",
	"离散的喷泉",
	"喷泉。。",
	"并发的喷泉",
	"调皮的喷泉",
	"喷喷喷",
	"喷得老高了",
	"有节奏的喷泉",
	"淡蓝色的喷泉",
	"梦幻的喷泉",
	"神奇的喷泉",
	"喷泉水柱",
	"喷啊喷",
	"挺壮观的",
	"交替的喷泉",
	"清澈的水面",
	"有点像花朵",
	"消失的花朵",
	"消失的花朵",
	"袭来的海啸",
	"一点都不可怕",
	"宁静的夜色",
	"秋水的夕阳",
	"夕阳下的滕王阁",
	"夕阳下的秋水",
	"南昌之星",
	"仰望摩天轮",
	"遥望远方",
	"那就是生米大桥了",
	"俯瞰夜南昌",
	"遥望八一大桥",
	"俯瞰南昌夜色",
	"俯瞰夜色下的南昌",
	"这运动场还亮着",
	"欣赏南昌夜色",
	"欣赏夜色南昌",
	"宁静的夜晚",
	"这花挺好看",
	"八一纪念石碑",
	"八一广场",
	"红星下八一广场",
	"寂静的八一广场",
	"醉码",
	"绳金塔广场",
	"绳金塔",
	"夜晚的南昌马尔代码",
	"透着点诡异的红色",
	"黑夜中的光",
	"遥望滕王阁",
	"有人说切三角形",
	"双子塔",
	"欲拒还迎",
	"暗淡的南昌之星",
	"空无一人的落寞",
	"寂静南昌之星",
	"寂静的南昌之星",
	"落寞",
	"enmmmmmm",
	"归程",
	"最后一眼南昌之星",
	"最后一眼南昌之星",
	"最后一眼南昌",
	"灰色的天",
	"阴天",
	"洗不清的水",
	"已到方特",
	"离开方特",
	"久违的厦门"
];


var iIndex = 0;

$(function(){
	if(!flux.browser.supportsTransitions)
		alert("浏览器不支持css3，请升级浏览器！");
		
	window.f = new flux.slider('#slider', {
		pagination: false,
		controls: false,
		transitions: ['explode', 'tiles3d', 'bars3d', 'cube', 'turn'],
		// width:700,
		// height:400,
		autoplay: false
	});
	
	//picture change
	// $(".images div").css({
	// 	"background-image" : "url('"+ oImgExports[iIndex] +"')",
	// 	"background-size" : "100% 100%"
	// })

	var sWord = (iIndex + 1) + "." + oImgExports[iIndex];

	$("#dvExport-font").html(sWord).fadeIn(1500);

	$('.transitions li').click(function(event){
		
		$("#dvExport-font").hide();
		$("#dvExport").hide();
	
		event.preventDefault();

		if("prev" == $(this).attr("operate"))
		{

		iIndex--;
		if(iIndex < 0){
			iIndex = oImgExports.length - 1;
		}
 
		window.f.prev($(event.target).data('transition'), $(event.target).data('params'));
 	
		}else if("next" == $(this).attr("operate")){
			iIndex++; 
			if(iIndex >= oImgExports.length){
				iIndex = 0;
			}
		window.f.next($(event.target).data('transition'), $(event.target).data('params'));
 			
		}

		$("#dvExport").fadeIn(2000);
	 	sWord = (iIndex + 1) + "." + oImgExports[iIndex];
		$("#dvExport-font").html(sWord).fadeIn(2000);
	});

	$("#dvStart").click(function(){
		$("#dvWelcome").fadeOut();
	})

	//增加看大图
	$("#dvBigImage").click(function(){

		var oBigShows = $("html #dvMyBigImgShow");
		if(oBigShows.length == 0)
		{
			$("<div id='dvMyBigImgShow'><div class='csDVBigClose' title='点击关闭' ></div></div><img id='imgBigShow' style='display:none' />").appendTo($("html"));

			$(".csDVBigClose").click(function(){
				$("#imgBigShow").hide();
				$("#dvMyBigImgShow").fadeOut(300);
			})
			$("#dvMyBigImgShow").click(function(){
				$(".csDVBigClose").click();
			})
		}else{
			oBigShows.fadeIn(400);
			$("#imgBigShow").show();
		}


		var sImgUrl = $(".image1").css("backgroundImage").replace("small", "big");
		$("#imgBigShow").attr("src", sImgUrl.substring(sImgUrl.indexOf("(")+2,sImgUrl.indexOf(")")-1))

		$("#imgBigShow").load(function(){
			$(this).show();
		})
	});
});
</script>

<div id="dvBackground" >
	<section class="container">
		<div id="slider" >  
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/1.JPG" title="这么有诗意的吗？"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/2.JPG" title="葛优躺"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/3.JPG" title="夕阳"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/4.JPG" title="假装一下"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/5.JPG" title="盘旋的大雁"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/6.JPG" title="妖艳喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/7.JPG" title="离散的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/8.JPG" title="喷泉。。"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/9.JPG" title="并发的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/10.JPG" title="调皮的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/11.JPG" title="喷喷喷"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/12.JPG" title="喷得老高了"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/13.JPG" title="有节奏的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/14.JPG" title="淡蓝色的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/15.JPG" title="梦幻的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/16.JPG" title="神奇的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/17.JPG" title="喷泉水柱"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/18.JPG" title="喷啊喷"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/19.JPG" title="挺壮观的"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/20.JPG" title="交替的喷泉"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/21.JPG" title="清澈的水面"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/22.JPG" title="有点像花朵"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/23.JPG" title="消失的花朵"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/24.JPG" title="消失的花朵"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/25.JPG" title="袭来的海啸"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/26.JPG" title="一点都不可怕"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/27.JPG" title="宁静的夜色"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/28.JPG" title="秋水的夕阳"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/29.JPG" title="夕阳下的滕王阁"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/30.JPG" title="夕阳下的秋水"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/31.JPG" title="南昌之星"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/32.JPG" title="仰望摩天轮"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/33.JPG" title="遥望远方"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/34.JPG" title="那就是生米大桥了"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/35.JPG" title="俯瞰夜南昌"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/36.JPG" title="遥望八一大桥"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/37.JPG" title="俯瞰南昌夜色"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/38.JPG" title="俯瞰夜色下的南昌"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/39.JPG" title="这运动场还亮着"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/40.JPG" title="欣赏南昌夜色"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/41.JPG" title="欣赏夜色南昌"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/42.JPG" title="宁静的夜晚"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/43.JPG" title="这花挺好看"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/44.JPG" title="八一纪念石碑"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/45.JPG" title="八一广场"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/46.JPG" title="红星下八一广场"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/47.JPG" title="寂静的八一广场"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/48.JPG" title="醉码"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/49.JPG" title="绳金塔广场"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/50.JPG" title="绳金塔"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/51.JPG" title="夜晚的南昌马尔代码"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/52.JPG" title="透着点诡异的红色"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/53.JPG" title="黑夜中的光"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/54.JPG" title="遥望滕王阁"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/55.JPG" title="有人说切三角形"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/56.JPG" title="双子塔"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/57.JPG" title="欲拒还迎"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/58.JPG" title="暗淡的南昌之星"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/59.JPG" title="空无一人的落寞"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/60.JPG" title="寂静南昌之星"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/61.JPG" title="寂静的南昌之星"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/62.JPG" title="落寞"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/63.JPG" title="enmmmmmm"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/64.JPG" title="归程"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/65.JPG" title="最后一眼南昌之星"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/66.JPG" title="最后一眼南昌之星"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/67.JPG" title="最后一眼南昌"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/68.JPG" title="灰色的天"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/69.JPG" title="阴天"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/70.JPG" title="洗不清的水"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/71.JPG" title="已到方特"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/72.JPG" title="离开方特"  />
			<img width="700" height="400" src="https://raw.githubusercontent.com/sherlock-help/sherlock.help/gh-pages/static/img/tours/南昌之行/73.JPG" title="久违的厦门"  />
			
			<div id="dvExport"></div>
			<!-- <div id="dvBigImage" title="点击看大图" ></div> -->
			<div id="dvExport-font"></div>
		</div>
		
		<ul class="transitions">
			<li class="li-extend" operate="prev"><button type="button" data-transition="turn">上一张</button></li>
			<li operate="next"><button type="button" data-transition="turn">下一张</button></li>
		</ul>	
	</section>
</div>
