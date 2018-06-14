"use strict";
//顶部返回按钮
~function(){
	$('.goback').tap(function(e){
		window.history.go(-1);
	})
}();
//顶部菜单按钮
~function(){
	$('.jfb-topBar .icon-menu').tap(function(){
		console.log(1);
	})
}();
//退出
~function(){
	$('.logout').tap(function(){
		$.ajax({
			type:'get',
			url:'./data/logout.php',
			dataType:'json',
			success:function(){
				window.location.reload()
			}
		});
	})
}();
//判断登陆
var islogin = function islogin(success, noLogin){
	$.ajax({
		type:'get',
		url:'./data/islogin.php',
		dataType:'json',
		success:callback
	});
	function callback(data){
		if(data.ok == 1){
			success(data)
		}else{
			if(noLogin){
				noLogin();
			}else{
				return false;
			}
		}
	}
};

