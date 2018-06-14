"use strict";
// 登录方式切换
~function(){
	var titleUsername = $('.page-title .title-username');
	var titleSms = $('.page-title .title-sms');
	var usernameLogin = $('.page-body .username_login');
	var smsLogin = $('.page-body .sms_login');


	titleUsername.tap(function(){
		titleSms.removeClass('active');
		$(this).addClass('active');
		smsLogin.hide();
		usernameLogin.show();

	});
	titleSms.tap(function(){
		titleUsername.removeClass('active');
		$(this).addClass('active');
		usernameLogin.hide();
		smsLogin.show();
	})
}();
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
//表单验证
~function(){
	/*用户名格式验证*/
	var unameReg = /^[a-zA-Z]\w{4,19}$/;
	var phoneReg = /^0?(1)[3-9][0-9]{9}$/;
	var upwdReg = /^\w{6,20}$/;
	var unameFlag = false;	//用户名标志位
	var upwdFlag = false;	//密码标识位
	var flag = false;	//公共标识位
	var tip = $(".username_login .notice");
	var pnoneTip = $(".sms_login .notice");

	/*输入验证*/
	$('#username')
		.on("focus", function(){
			$(this).css('color', '#000');
		})
		.on("blur", function(){
			if(unameReg.test(this.value) || phoneReg.test(this.value)){
				tip.html('').css("opacity", "0");
				$(this).css('color', '#000');
				unameFlag = true;
				flag = true;
			}else{
				tip.html('账号格式错误').css("opacity", "1");
				$(this).css('color', '#ff6c6c');
				unameFlag = false;
			}
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$('#username').blur();
				usernameSubmit();
			}else{
				return false;
			}
		});
	$('#password')
		.on("focus", function(){
			$(this).css('color', '#000');
		})
		.on("blur", function(){
			if(upwdReg.test(this.value)){
				tip.html('').css("opacity", "0");
				$(this).css('color', '#000');
				upwdFlag = true;
				flag = true;
			}else{
				tip.html('密码格式错误!').css("opacity", "1");
				$(this).css('color', '#ff6c6c');
				upwdFlag = false;
			}
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$('#password').blur();
				usernameSubmit();
			}else{
				return false;
			}
		});
	$('#username_code')
		.on("focus", function(){
			flag = true;
		})
		.on("keyup", function(event){
			var event = event || window.event;
			var code = event.charCode || event.keyCode;
			if(code === 13){
				$('#username_code').blur();
				usernameSubmit();
			}else{
				return false;
			}
		});

	/*点击登录事件*/
	$("#username_submit")
		.tap(usernameSubmit);

	/*表单提交*/
	function usernameSubmit(){
		if(unameFlag && upwdFlag && flag){
			var callback = function(data){
				if(data.flag === 1){	//登录成功
					// var uname = encodeURIComponent(data.uname);
					// C.setCookie({"name":"uname", "value":uname, "days":30, "path":"/"});
					window.location.href = "./index.html";
				}else{
					tip.html(data.flag).css("opacity", "1");
					flag = false;
				}
			};
			$.ajax({
				type:'post',
				url:'./data/login.php',
				data:{
					uname:$("#username").val(),
					upwd:$("#password").val(),
					code:$("#username_code").val()
				},
				dataType:"json",
				success:callback
			});
		}
	}


	$('#telphone')
		.on('keyup', function(){
			if(phoneReg.test(this.value) || this.value == ''){
				pnoneTip.html('').css("opacity", "0");
				$('.sms_login .getcode').removeAttr('disabled');
			}else{
				pnoneTip.html('手机号格式错误').css("opacity", "1");
				$('.sms_login .getcode').attr('disabled', 'disabled');
			}
		});
	$('.sms_login .getcode')
		.click(function(){
			$(this).attr('disabled', 'disabled');
			$(this).html('重发(' + 60 + 's)');
			var that = this;
			var i = 60;
			var timer;
			timer = setInterval(function(){
				i--;
				$(that).html('重发(' + i + 's)');
				if(i === 0){
					clearInterval(timer);
					$(that).removeAttr('disabled');
					$(that).html('重新发送');
				}
			}, 1000)
		});


}();