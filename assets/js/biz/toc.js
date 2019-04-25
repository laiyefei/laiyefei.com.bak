

/**
 * 侧边目录
 */
function generateContent() {
    var $dvToc = $('.csToc');
    var toc = $(".csDetailPost ul#markdown-toc").clone().get(0);
    $dvToc.each(function(i,o){
        $(o).html(toc);
    });
	
	var nowHeight = $dvToc.height();
	$dvToc.height(nowHeight + 20)



	var $rightToc = $dvToc.find("[id]");

	$rightToc.attr("times", 1);


	var runOneTimes = 1;
	;(function(runOneTimes){
		$rightToc.click(function(){		 
			if(runOneTimes++ < 2){
				(function(self){
					setTimeout(function(){
						self.click(); 
						runOneTimes = 1;
					}, 300);
				})(this);
			}
		});
	})(runOneTimes);

	//copy h target
	var $leftBodys = $(".csDetailPost").find(">*:not(ul)[id]");
	$leftBodys.each(function(){
		var $this = $(this);
		var newNode = $this.clone();//$("<div id='"+ this.id +"'>"+ .html() +"</div>");
		newNode[0].id = "show_" + $this[0].id;
		newNode.insertAfter($this);

		$this.html("");
		$this.css({
			"padding" : "40px",
			"display" : "none"
		});


		var href = decodeURIComponent(window.location.href);
		var hrefParams = href.split("#");
		if(0 < hrefParams.length && this.id == hrefParams[1]){
			$('#' + hrefParams[1]).show();
			$("#show_" + hrefParams[1]).css({
				"font-weight" : "bold"
			});



			var $ele = $dvToc.find("*[href='#"+ this.id +"']");
			var times = $ele.attr("times");
				times = parseInt(times);
			if(times <= 2){ 
				(function($ele, times){
					$ele.attr("times", ++times);
					setTimeout(function(){
						$ele[0].click();
						setTimeout(function(){
							$ele[0].click();
						}, 300);
					}, 300);
				})($ele, times);			
			}
		} 

		//add class for use 
		for(var i=0; i < 7; i++){
			var tag = "H" + i;
			switch(newNode[0].tagName){
				case tag:
					newNode.css({
						"margin-bottom" : ((7 - i) * 5) + "px"
					});
				break;
			}	
		} 


	});


	$rightToc.click(function(){
		if(!this.attributes.href){
			return;
		}
		$leftBodys.hide();
		$leftBodys.each(function(){
			$("#show_" + this.id).css({
				"font-weight" : "normal"
			});
		});

		var theid = this.attributes.href.value.substring(1);


		$('#' + theid).show();
		$("#show_" + theid).css({
			"font-weight" : "bold"
		});
	});

	$(window).scroll(function() {
 		$leftBodys.hide(); 		
	}); 
}

(function(){

	
	var screenHeight = window.screen.height;
	var $dvToc = $(".csToc");
	var maxHeight = (screenHeight - 250);
	$dvToc.css({
		"max-height" : maxHeight + "px"
	});  

	$("blockquote p").css({
		"text-indent" : 0
	});
})();



