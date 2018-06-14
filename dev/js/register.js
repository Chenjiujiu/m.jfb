"use strict";
//清空按钮
~function(){
	$('.page-body input').on('input', function(){
		if(this.value !== ''){
			$(this).siblings('.icon-font').show();
		}else{
			$(this).siblings('.icon-font').hide();
		}
	});
	$('.page-body .icon-font').tap(function(){
		$(this).siblings('input').val('');
		$(this).hide()
	})
}();

//验证码
~function(){
	$('.page-body .input-code .code-box img').tap(function(){
		$(this).attr("src", "./data/codepic.php?r=" + new Date().getTime());
	})
}();

~function(){
	var unameFlag = false;	//用户名标志位
	var iphoneFlag = false;	//手机号标志位
	var codeFlag = false;	//验证码标志位
	var upwdFlag = false;	//密码标识位
	var verifyFlag = false;	//确认密码标识位
	var flag = false;	//公共标识位

	var unameReg = /^[a-zA-Z]\w{4,19}$/;	//用户名正则
	var phoneReg = /^0?(1)[3-9][0-9]{9}$/;	//电话号码正则
	var upwdReg = /^\w{6,20}$/;	//密码正则
	var codeReg = /^\w{4}$/;	//验证码正则

	var tip = $("#notice-tip");

	/*提交事件*/
	function submit(){
		if(unameFlag && iphoneFlag && upwdFlag && verifyFlag){
			var uname = $("#username").val();
			var iphone = $("#tel").val();
			var upwd = $("#password").val();
			var code = $("#code").val();
			var callback = function(data){
				if(data.flag === 1){
					$('#model-success').show();
					C.setCookie({"name":"uid", "value":data.uid, "days":30, "path":"/"});
				}else{
					tip.html(data.msg).css("opacity", "1");
					flag = false;
				}
			};
			$.ajax({
				type:'post',
				url:'./data/register.php',
				data:{
					"uname":uname,
					"uphone":iphone,
					"upwd":upwd,
					"code":code,
				},
				dataType:"json",
				success:callback
			});
		}
	}

	/*用户名验证*/
	$("#username")
		.on("focus", function(){
			$(this).css('color', '#000');
		})
		.on("blur", function(){
			if(unameReg.test(this.value)){
				$.ajax({
					type:"post",
					url:"./data/inputTest.php",
					data:{uname:this.value},
					success:unametest
				});
			}else{
				tip.html('账号格式错误').css("opacity", "1");
				$(this).css('color', '#ff6c6c');
				unameFlag = false;
			}
			function unametest(data){
				var input = $("#username");
				if(data == 1){
					input.css('color', '#ff6c6c');
					tip.html('用户名已存在').css("opacity", "1");
					unameFlag = false;
				}else if(data == 0){
					tip.html('').css("opacity", "0");
					input.css('color', '#000');
					unameFlag = true;
					flag=true;
				}else{
					input.css('color', '#ff6c6c');
					tip.html('服务器正忙,请稍后再试!').css("opacity", "1");
					unameFlag = false;
				}
			}
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$(this).blur();
				submit();
			}else{
				return false;
			}
		});

	/*手机号验证*/
	$("#tel")
		.on("focus", function(){
			$(this).css('color', '#000');
		})
		.on("blur", function(){
			if(phoneReg.test(this.value)){
				$.ajax({
					type:"post",
					url:"./data/inputTest.php",
					data:{uphone:this.value},
					success:phonetest
				});
			}else{
				tip.html('手机号格式错误').css("opacity", "1");
				$(this).css('color', '#ff6c6c');
				iphoneFlag = false;
			}
			function phonetest(data){
				var input = $("#tel");
				if(data == 1){
					input.css('color', '#ff6c6c');
					tip.html('手机号码已被注册').css("opacity", "1");
					iphoneFlag = false;
				}else if(data == 0){
					tip.html('').css("opacity", "0");
					input.css('color', '#000');
					iphoneFlag = true;
					flag=true;
				}else{
					input.css('color', '#ff6c6c');
					tip.html('服务器正忙,请稍后再试!').css("opacity", "1");
					iphoneFlag = false;
				}
			}
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$(this).blur();
				submit();
			}else{
				return false;
			}
		});

	/*密码格式验证*/
	$("#password")
		.on("focus", function(){
			$(this).css('color', '#000');
		})
		.on("blur", function(){
			var pwd2=$("#password2");
			/*格式验证*/
			if(upwdReg.test(this.value)){
				tip.html('').css("opacity", "0");
				$(this).css('color', '#000');
				upwdFlag = true;
				flag=true;
			}else{
				tip.html('密码格式错误').css("opacity", "1");
				$(this).css('color', '#ff6c6c');
				upwdFlag = false;
			}
			/*确认密码验证*/
			if(pwd2.val() !== "" && this.value !== pwd2.val()){
				tip.html('两次密码不一致').css("opacity", "1");
				pwd2.css('color', '#ff6c6c');
				verifyFlag = false;
			}else if(pwd2.val() !== "" && this.value === pwd2.val()){
				tip.html('').css("opacity", "0");
				pwd2.css('color', '#000');
				verifyFlag = true;
				flag=true;
			}
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$(this).blur();
				submit();
			}else{
				return false;
			}
		});

	/*重复密码验证*/
	$("#password2")
		.on("focus", function(){
			$(this).css('color', '#000');
		})
		.on("blur", function(){
			if(this.value === ""){
				verifyFlag = false;
			}else if(this.value === $("#password").val()){
				tip.html('').css("opacity", "0");
				$(this).css('color', '#000');
				verifyFlag = true;
				flag=true;
			}else{
				tip.html('两次密码不一致').css("opacity", "1");
				$(this).css('color', '#ff6c6c');
				verifyFlag = false;
			}
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$(this).blur();
				submit();
			}else{
				return false;
			}
		});

	/*验证码*/
	$('#code')
		.on("focus", function(){
			flag = true;
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$(this).blur();
				submit();
			}else{
				return false;
			}
		});

	/*提交按钮*/
	$('#submit').tap(submit)
}();

/*

C("#submit-btn").click(function(){
	if(unameFlag && iphoneFlag && codeFlag && upwdFlag && verifyFlag){
		var uname = C("#uname-input").val();
		var iphone = C("#iphone-input").val();
		var upwd = C("#upwd-input").val();
		var callback = function(data){
			if(data.flag === 1){
				C(".succeed").show();
				C("body").css("overflow-x", "hidden");
				C.setCookie({"name":"uid", "value":data.uid, "days":30, "path":"/"});
				var span = C(".succeed .outtime");
				var time = 5;
				setInterval(function(){
					time--;
					span.html(time);
					if(span.html() <= 0){
						span.html(0);
						location.href = "../index.html";
					}
				}, 1000)
			}else{
				C(".error").show();
				C(document).click(modalBox);
			}
		};
		C.ajax({
			type:'post',
			url:'../data/register.php',
			data:{
				"uname":uname,
				"uphone":iphone,
				"upwd":upwd
			},
			dataType:"json",
			fn:callback
		});
	}
});	//提交


var modalBox = function(event){
	if(C.target(event) === C(".error").get(0)){
		C(".error").hide();
		C(document).un("click", modalBox);
	}
};	//模态框*/
