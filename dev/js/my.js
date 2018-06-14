"use strict";
~function(){
	islogin(function(){
		$.ajax({
			type:'get',
			url:'./data/getuserinfo.php',
			dataType:'json',
			success:callback
		})
	}, function(){
		$('#jfb-modal').show();
		$('.jfb-footer .mylogin span').html('未登录')
	});
	function callback(data){
		console.log(data);
		var avatar='./images/avatar/'+data.user.avatar;
		var name=data.user.uname;
		var status=data.status;
		if(data.user.user_name){
			name = data.user.user_name
		}
		$('.jfb-header .header-user .user-pic img').attr('src',avatar);
		$('.jfb-header .header-user .user-name span').html(name);
		$('.jfb-nav .wait-pay .num').html(status.pay);
		$('.jfb-nav .wait-send .num').html(status.send);
		$('.jfb-nav .wait-accept .num').html(status.num);
		$('.jfb-nav .wait-comment .num').html(status.comment);
		$('.jfb-nav .after-serve .num').html(status.serve);

	}
}();