"use strict";
//左边导航滑动
~function(){
	var navBox = $('.jfb-category .category-nav');
	var navList = navBox.find('.nav-list');
	var height = navBox.offset().height;
	var allHeight = navList.offset().height;

	var timer = null,
		startY = 0,
		endY = 0,
		moveY = 0,
		currentY = 0,
		startTime=0,
		endTime=0;

	navList.on('touchstart', function(e){
		startTime=new Date().getTime();
		startY = e.touches[0].clientY;
		removeTransition()
	});

	navList.on('touchmove', function(e){
		endY = e.touches[0].clientY;
		moveY = endY - startY;
		if(currentY + moveY >= 150){
			addTransition();
			moveY = 0;
			currentY=0;
		}else if((currentY + moveY) <=height-allHeight-150-45-44 ){
			addTransition();
			moveY = 0;
			currentY=height-allHeight-44-45;
		}
		setTransform(currentY + moveY);
	});

	navList.on('touchend', function(e){
		endTime=new Date().getTime();

		if(endTime-startTime <= 150&& moveY===0){
			$(e.target.parentNode).siblings().removeClass('active');
			$(e.target.parentNode).addClass('active');
		}
		currentY = currentY + moveY;
		moveY=0;

		if(currentY + moveY >= 0){
			addTransition();
			moveY = 0;
			currentY=0;
		}else if((currentY + moveY) <=height-allHeight-44-45){
			addTransition();
			moveY =0;
			currentY=height-allHeight-44-45;
		}
		setTransform(currentY + moveY);

	});


	var setTransform = function(w){
		navList.css('transform', 'translateY(' + w + 'px)');
		navList.css('webkitTransform', 'translateY(' + w + 'px)');
	};

	var addTransition = function(){
		navList.css('transition', 'all .5s ease 0s');
		navList.css('webkitTransition', 'all .5s ease 0s');
	};

	var removeTransition = function(){
		navList.css('transition', 'none');
		navList.css('webkitTransition', 'none');
	};
}();

// 导航切换
~function(){
	$(".jfb-category .nav-list li").tap(function(){
		var num = Math.ceil(Math.random()*24);
		$('.category-body .product-title').html($(this).text());
		$('.category-body .box-banner img').attr('src','./images/slide/s'+num+'.jpg');


	})
}();