"use strict";
//搜索滚动改变透明度
~function(){
	var search = $('.jfb-header-box');
	var banner = $('.jfb-banner');
	var h = banner.offset().height;
	$(window).on('scroll', function(){
		var a = 0.9 * $(this).scrollTop() / h;
		a = a >= 0.9 ? 0.9 : a;
		search.css('background', 'rgba(02,140,232,' + a + ')')
	})
}();
//轮播图
~function(){
	var imgBox = $('.jfb-banner-img');
	var imgs = $('.jfb-banner-img li');
	var dots = $('.jfb-banner-dot li');
	var width = $('.jfb-banner').offset().width;
	var index = 1,
		timer = null,
		startX = 0,
		endX = 0,
		moveX;

	timer = setInterval(function(){
		index++;
		addTransition();
		setTransform(-index * width);
		setDot(index);
	}, 2000);

	imgBox.on('touchstart', function(e){
		clearInterval(timer);
		startX = e.touches[0].clientX;
	});

	imgBox.on('touchmove', function(e){
		endX = e.touches[0].clientX;
		moveX = endX - startX;
		removeTransition();
		setTransform(-index * width + moveX);
	});

	imgBox.on('touchend', function(){
		var moveXabs = Math.abs(moveX);
		if(endX !== 0 && moveXabs >= (width / 3)){
			index -= moveX / moveXabs
		}
		addTransition();
		setTransform(-index * width);
		setDot(index);
		endX = 0;
		timer = setInterval(function(){
			index++;
			addTransition();
			setTransform(-index * width);
			setDot(index);
		}, 2000);
	});

	imgBox.on('transitionEnd', function(){
		if(index >= imgs.length - 2){
			removeTransition();
			setTransform(0);
			index = 0;
		}else if(index <= 0){
			removeTransition();
			setTransform(imgs.length - 1 * width);
			index = imgs.length - 2;
		}
	});
	imgBox.on('webkitTransitionEnd', function(){
		if(index >= imgs.length - 2){
			removeTransition();
			setTransform(0);
			index = 0;
		}else if(index <= 0){
			removeTransition();
			setTransform(-(imgs.length - 2) * width);
			index = imgs.length - 2;
		}
	});

	var setDot = function(index){
		dots.removeClass('now');
		dots.eq(index - 1).addClass('now');
	};

	var setTransform = function(w){
		imgBox.css('transform', 'translateX(' + w + 'px)');
		imgBox.css('webkitTransform', 'translateX(' + w + 'px)');
	};

	var addTransition = function(){
		imgBox.css('transition', 'all .5s ease 0s');
		imgBox.css('webkitTransition', 'all .5s ease 0s');
	};

	var removeTransition = function(){
		imgBox.css('transition', 'none');
		imgBox.css('webkitTransition', 'none');
	};
}();
//绑定轮播图
~function(){
	$.ajax({
		url:"./data/index_slider.php",
		type:"get",
		data:{maxnum:8},
		dataType:"json",
		success:callback
	});
	function callback(data){
		data.push(data[0]);
		data.unshift(data[data.length - 2]);
		var item = '<li><a href="#{href}"><img src="./images/#{img}" alt=""></a></li>';
		C(".jfb-banner-img").bindHtml(item, data);
	}
}();
//绑定各楼层
~function(){
	//获取数据
	$.ajax({
		url:'./data/index_floor.php',
		type:'get',
		dataType:'json',
		data:{nums:8},
		success:callback
	});
	//绑定数据
	function callback(data){
		var item = '<a href="#{href}"><img src="./images/#{pic}" alt="#{title}"></a>';
		C('#wntj .all').bindHtml(item, data[0].splice(0, 8));

		C('#clxk .big').bindHtml(item, data[1].big);
		C('#clxk .small').bindHtml(item, data[1].small.splice(0, 4));

		C('#ppxx .big').bindHtml(item, data[2].big);
		C('#ppxx .small').bindHtml(item, data[2].small.splice(0, 4));

		C('#jppx .big').bindHtml(item, data[3].big);
		C('#jppx .small').bindHtml(item, data[3].small.splice(0, 4));

		C('#ssnx .all').bindHtml(item, data[4].small.splice(0, 8));

		C('#txzq .all').bindHtml(item, data[5].small.splice(0, 8));
	}

}();
//登陆判断
~function(){
	islogin(function(data){
		$('.jfb-header .login').hide();
		$('.jfb-header .logout').show();
		$('.jfb-footer .mylogin a').attr('href','./my.html').find('span').html('我的');
	},function(){
		$('.jfb-header .logout').hide();
		$('.jfb-header .login').show();
		$('.jfb-footer .mylogin a').attr('href','./login.html').find('span').html('未登录');
	})

}();

//秒杀倒计时
~function secondKill (){
	var parentTime =$('.jfb-secondKill .sk-time');
	var timeList = $('.jfb-secondKill .sk-time .time-num');

	var times = 5.32* 60 * 60;
	var timer;
	timer = setInterval(function(){
		times  -- ;
		var h = Math.floor(times/(60*60));
		var m = Math.floor(times/60%60);
		var s = times%60;

		timeList.eq(0).html(h>10?Math.floor(h/10):0);
		timeList.eq(1).html(h%10);

		timeList.eq(2).html(m>10?Math.floor(m/10):0);
		timeList.eq(3).html(m%10);

		timeList.eq(4).html(s>10?Math.floor(s/10):0);
		timeList.eq(5).html(Math.floor(s%10));
		if(times <= 0){
			clearInterval(timer);
		}
	},1000);
}();
//搜索
~function(){
	$(".jfb-header .form input").on("keyup", function(){
		var code=event.charCode || event.keyCode;
		if(code===13){
			var value = this.value.replace(/[^(0-9a-zA-Z)|(\s)|(\u4e00-\u9fa5)]/g, "");
			window.location.href='./search.html?keywords='+value;
		}else{
			return false;
		}
	})
}();