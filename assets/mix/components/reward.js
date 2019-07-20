$(function() {
    $(".pay_item").click(function() {
        $(this).addClass('checked').siblings('.pay_item').removeClass('checked');
        var dataid = $(this).attr('data-id');
        $(".shang_payimg img").attr("src", "/assets/mix/components/img/" + dataid + "2.jpg");
        $("#shang_pay_txt").text(dataid == "alipay" ? "支付宝": "微信")
    })
    $(".hide_box").click(function(){
		$("#dvReward").hide();
    });
});

function rewardTaggle(){
	$("#dvReward").show();
}

function hideReward(){
	$("#dvReward").hide();
}