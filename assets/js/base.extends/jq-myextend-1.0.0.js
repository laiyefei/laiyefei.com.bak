// author : sherlock
// date : 2017-01-07
// describe : this is my lib for extend jq
// version : v1.0.0
'use strict';
;define(function(){

    //declare a object for return
    var oMyJqExtends = {};

      //add extend to sherlock ============================================================================
  	var win = {};
  	win.initCss = null;
  	win.endCss = null;
  	win.runTimeLength = 1000;
  	win.open = function(oThisObj, oEvent){
  		//Math.round(Math.random() * 10) % 4
  		if(null == win.initCss){
  			var iLeft = null, iTop = null, iWidth = null, iHeight = null;

  			if(null != oEvent || "undefined" != typeof oEvent)
  			{
  				iWidth = "0%";
  				iHeight = "0%";
  				iLeft=(oEvent.clientX/window.innerWidth)*100 +'%';
  				iTop=(oEvent.clientY/window.innerHeight)*100 +'%';

  			}else{
  			 	switch(Math.round(Math.random() * 10) % 6 ){
  					case 0:
  						iLeft = "50%";iTop = "0%";iWidth = "0%";iHeight = "100%";
  						break;
  					case 1:
  						iLeft = "0%";iTop = "50%";iWidth = "100%";iHeight = "0%";
  						break;
  					case 2:
  						iLeft = "0%";iTop = "0%";iWidth = "100%";iHeight = "0%";
  						break;
  					case 3:
  						iLeft = "0%";iTop = "0%";iWidth = "0%";iHeight = "100%";
  						break;
  					case 4:
  						iLeft = "100%";iTop = "0%";iWidth = "0%";iHeight = "100%";
  						break;
  					case 5:
  						iLeft = "0%";iTop = "100%";iWidth = "100%";iHeight = "0%";
  						break;
  					default:
  						iLeft = "0%";iTop = "0%";iWidth = "0%";iHeight = "0%";
  						break;
  				}
  			}

  			win.initCss = {left:iLeft, top:iTop, width:iWidth, height:iHeight, background:"black",border:"0",opacity:"0"}; //borderRadius:"100%"
  		}
  		if(null == win.endCss){
  			win.endCss = {
  				left:"1%",width:"98%",height:"98%",background:"white",
  				top:"1%",border:"0",opacity:"1"}; //borderRadius:".61%"
  		}
  		$(oThisObj).css(win.initCss);
  		$(oThisObj).animate(win.endCss, win.runTimeLength);
  	}
  	win.close = function(oThisObj){
  		if(null == win.initCss || null == win.endCss){
  			sherlock.console.log("%cError: wrong ! this style can't be fined, can't close this window", "color:red");
  			return;
  		}
  		$(oThisObj).animate(win.initCss, win.runTimeLength);
  		setTimeout(function(){
  			win.initCss = null;
  		}, win.runTimeLength + 100);
  	}
  	win.fnCsDo = function(oThis, sOperation, sSign, oEvent){
  		//.animate({top:'0%'},900);   sSign is a param to sign this window opener id
  		win[sOperation](oThis, oEvent);
  	}
  	win.opWinIframe = function(oThis, sImId, sUrl, sSign, oEvent){
  		//get sure the normal open, and log information to the console
  		if(null == oThis){
  			sherlock.console.log("%cError: will add iframe window object can not be null", "color:red");
  			return;
  		}else{
  			var oWinIf =  document.getElementById("dv"+ sImId);
  			if(null != oWinIf){
  				sherlock.console.log("%cError: this iframe id had been exist, please call another", "color:red");
  				return;
  			}
  			if(null == sUrl || "" == sUrl){
  				sherlock.console.log("%cError: this iframe url can not be empty", "color:red");
  				return;
  			}
  			oWinIf = document.createElement("iframe");
  			var odvWinIf = document.createElement("div");
  			odvWinIf.id = "dv"+sImId;
  			odvWinIf.setAttribute("style", "z-index:9999;position:absolute;background:black;top:0;");
  			odvWinIf.className += " setDvIframe";
  			//odvWinIf.style.zIndex = 999;
  			if(null == sSign){
  				//default it open 100 persent
  				odvWinIf.style.width = "100%";
  				odvWinIf.style.height = "100%";
  			}else{
  				//odvWinIf.className = sOpClass;
  			 //	odvWinIf.style.width = "96%";
  			//	odvWinIf.style.height = "96%";
  				// $(odvWinIf).animate(sOpClassJson, 990);
  				win.fnCsDo(odvWinIf, "open", sSign, oEvent);
  			}
  			//add content for new iframe window
  			oWinIf.id = sImId;
  			oWinIf.frameborder = "0";
  			oWinIf.scrolling = "no";
  			oWinIf.width = "100%";
  			oWinIf.height = "100%";
  			oWinIf.setAttribute("style", "border:0;position:absolute;left:0%;top:0%;");
  			oWinIf.src = sUrl;

  			//background div
  			var obgDiv = document.getElementById("dvStBg");
  			if(null == obgDiv)
  			{
  				obgDiv = document.createElement("div");
  				obgDiv.id = "dvStBg";
  				obgDiv.style.width = "100%";
  				obgDiv.style.height = "100%";
  				obgDiv.setAttribute("style", "display:none;opacity:.33;filter:alpha(opacity=33);border:0;position:absolute;background:white;top:0;left:0;width:100%;height:100%;");
  				oThis.appendChild(obgDiv);
  			}
  			setTimeout(function(){
  				$(obgDiv).fadeIn();
  			},300)
  			oThis.appendChild(odvWinIf);
  			setTimeout(function(){
  				odvWinIf.appendChild(oWinIf);
  				//complete add iframe add exit button in iframe window
  				var sOrigin = location.origin;

  				//the shadow of sherlock png
  				$("#dvCCWel").fadeOut();
  				window.frames[sImId].onload = function(){

  					this.focus();

  					(this.contentWindow || this).oncontextmenu=function(){return false;}
  					// this.contentWindow.ondragstart=function(){return false}
  					// this.contentWindow.onselectstart=function(){return false}
  					// this.contentWindow.onbeforecopy=function(){return false}
  					// this.contentWindow.onselect=function(){return false;}
  					// this.contentWindow.oncopy=function(){return false;}
  					// this.contentWindow.ondrop=function(){return false;}
  					// this.contentWindow.onmouseup=function(){return false;}
  					// this.contentWindow.onmousedown = function(){return false;}

  					var oImBody = (this.contentWindow || this).document.getElementsByTagName("body")[0];
  					//add a cache to add all object and append in one time
  					var oAllAppend = document.createDocumentFragment();
  					//exit button div
  					var odvExImWin = document.createElement("div");
  					odvExImWin.setAttribute("style", "z-index:9999");
  					odvExImWin.id = "dvEx" + sImId;
  					//exit button style
  					var oexStyle = document.createElement("style");
  					oexStyle.type = "text/css";//cursor: url(static/img/leaf.ico),auto; cursor: url(static/img/oleaf.ico),auto;
  					var sExFeetUrl = "../img/exFeet.png";
  					if(s.judg.isBrowserType("ie"))
  					{
  						sExFeetUrl = "../img/exFeet.png";
  					}
  					//var sLeaveCursor = "cursor:url(../img/leaf.ico),auto;}*:hover{cursor:url(../img/leaf.ico),auto;}*:link{cursor:url(../img/leaf.ico),auto;}*:active{cursor:url(../img/oleaf.ico),auto;}*:visited{cursor:url(../img/leaf.ico),auto;";
  					oexStyle.innerHTML = "html,body{width:100%;height:100%;overflow-y:auto}*{padding:0;margin:0;/*-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;-user-select:none;*/}#dvEx" + sImId +":hover{opacity:0.7;filter:alpha(opacity=70);cursor:pointer;}#dvEx" + sImId +":active{opacity:1;filter:alpha(opacity=100);}#dvEx" + sImId +"{opacity:0.3;filter:alpha(opacity=30);z-index:101;position:absolute;margin-left:90%;top:80%;width:50px;height:50px;background:url("+ sExFeetUrl +") no-repeat;background-size:50px 50px;}";
  					//add exit button event   sExClass
  					odvExImWin.onclick = function(){
  						$(window.parent.document.getElementById("dvCCWel")).fadeIn();

  						$("#dvStBg").fadeOut();
  						var oImIds = this.id.split("dvEx");
  						if(null != oImIds[1]){
  							var oThWinDiv = window.parent.document.getElementById("dv"+oImIds[1]);
  							if(null == sSign ){
  								oThWinDiv.style.width = "0";
  								oThWinDiv.style.height = "0";
  								oThWinDiv.style.display = "none";
  								oThWinDiv.parentNode.removeChild(oThWinDiv);
  							}else{
  								//oThWinDiv.className =  oThWinDiv.className.replace( sOpClass, sExClass);
  								//$(oThWinDiv).animate(sExClassJson, 990);
  								if (null != (window.frames[sImId].contentWindow || window.frames[sImId]).exWinClick)
  									(window.frames[sImId].contentWindow || window.frames[sImId]).exWinClick(function(){
  										win.fnCsDo(oThWinDiv, "close", sSign);
  										setTimeout(function(){
  											oThWinDiv.parentNode.removeChild(oThWinDiv);
  										}, 1000);
  									});
  								else{
  									win.fnCsDo(oThWinDiv, "close", sSign);
  									setTimeout(function(){
  										oThWinDiv.parentNode.removeChild(oThWinDiv);
  									}, 1000);
  								}
  							}
  						}
  					}

  					oAllAppend.appendChild(oexStyle);
  					oAllAppend.appendChild(odvExImWin);
  					oImBody.appendChild(oAllAppend);
  				}
  			}, 500);
  		}
  	}
  	win.opModelWin = function(sUrl, sWidth, sHeight){
  	    var sLeft= (window.screen.availWidth -sWidth)/2;
  	  	var sTop= (window.screen.availHeight-sHeight)/2;
  	    window.open(sUrl,"window","height ="+ sHeight +",width ="+ sWidth +",top="+ sTop +",left="+ sLeft +",toolbar=no,menubar=no, scrollbars=yes,  location=no,resizable=yes, status=no,z-look=yes,alwaysRaised=yes");
  	}
  	win.opModelDialog = function(sUrl, sWidth, sHeight){
  		if(s.judg.isBrowserType("ie"))
  		{
  		    var sLeft= (window.screen.availWidth - sWidth)/2;
  		   	var sTop= (window.screen.availHeight - sHeight)/2;
  		    var returnValue=window.showModalDialog(sUrl, window, "dialogHeight:"+ sHeight +"px;dialogWidth:"+ sWidth +"px;dialogTop:"+ sTop +"px;dialogLeft:"+ sLeft +"px;edge:Raised;center:Yes;help:Yes;resizable:Yes;scrollbars:auto;status:No;")
  		    return returnValue;
  		}else{
  			  sherlock.console.log("%cSorry, this function of name opModelDialog is only can use by ie !", "color:red");
  		}
  	}


    //final hood the function to mylib
    oMyJqExtends = {
    	win : win
    }

    //final return object
    return oMyJqExtends;
})
