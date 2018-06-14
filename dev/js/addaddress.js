"use strict";
~function(){
	var aid = C.getserch('aid');
	var nameReg = /^[A-Za-z\u4e00-\u9fa5_]+$/,
		PhoneReg = /^0?(1)[3-9][0-9]{9}$/,
		consignee = '',
		cellphone = '',
		province = '',
		city = '',
		county = '',
		address = '';
	if(aid != 0){
		$('.del').show();
		$.ajax({
			url:'./data/getAddress.php',
			type:'post',
			data:{aid:aid},
			dataType:"json",
			success:function(data){
				$('#consignee').val(data.consignee);
				$('#cellphone').val(data.cellphone);
				$('#addre').val(data.province + data.city + data.county);
				$('#address').val(data.address);
				if(data.is_default == 1){
					$('.is-default i')
						.html('&#xe914;')
						.css('color', '#028ce8')
						.parent()
						.attr('data-d', '1');
				}
				consignee = data.consignee;
				cellphone = data.cellphone;
				province = data.province;
				city = data.city;
				county = data.county;
				address = data.address;
			}
		})
	}
	$('#consignee')
		.focus(function(){
			$(this).removeClass('error');
		})
		.blur(function(){
			var value = this.value;
			if(nameReg.test(value)){
				$(this).removeClass('error');
				consignee = value;
			}else{
				$(this).addClass('error');
				consignee = '';
			}
		});
	$('#cellphone')
		.focus(function(){
			$(this).removeClass('error');
		})
		.blur(function(){
			var value = this.value;
			if(PhoneReg.test(value)){
				$(this).removeClass('error');
				cellphone = value;
			}else{
				$(this).addClass('error');
				cellphone = '';
			}
		});
	$('#address').blur(function(){
		address = this.value;
	});
	$('#addre').focus(function(){
		bindcity(1);
		$('.jfb-city .city-box .province').html('请选择').addClass('current');
		$('.jfb-city .city-box .city').html('').removeClass('current');
		$('.jfb-city .city-box .county').html('').removeClass('current');
		$('.jfb-city').show();
		$('.jfb-city .city-box').height('85%');
	});


	var startY = 0,
		moveY = 0,
		currentY = 0,
		box = $('.jfb-city .citys-list');
	box.on('touchstart', function(e){
		startY = e.touches[0].clientY;
	})
		.on('touchmove', function(e){
			moveY = e.touches[0].clientY - startY;
			var maxY = $('.jfb-city .citys').height() - box.height() - 100;
			if(Math.abs(moveY) < 2){
				return false;
			}
			var w = moveY + currentY;
			if(w > 0){
				w = 0
			}else if(w < maxY){
				w = maxY;
			}
			box.css('transform', 'translateY(' + w + 'px)');
			box.css('webkitTransform', 'translateY(' + w + 'px)');
		})
		.on('touchend', function(e){
			currentY += moveY;
		})
		.on('tap', 'li', function(){
			if($(this).data('type') == 1){
				$('.jfb-city .city-box .province').html($(this).html()).removeClass('current');
				$('.jfb-city .city-box .city').html('请选择').addClass('current');
				$('.jfb-city .city-box .county').html('').removeClass('current');
				province = $(this).html();
			}else if($(this).data('type') == 2){
				$('.jfb-city .city-box .province').removeClass('current');
				$('.jfb-city .city-box .city').html($(this).html()).removeClass('current');
				$('.jfb-city .city-box .county').html('请选择').addClass('current');
				city = $(this).html();
			}else{
				$('.jfb-city .city-box .province').removeClass('current');
				$('.jfb-city .city-box .city').removeClass('current');
				$('.jfb-city .city-box .county').html($(this).html()).addClass('current');
				county = $(this).html();
				$('.jfb-city').hide();
				$('.jfb-city .city-box').height(0);
				$('#addre').val(province + city + county)
			}
			bindcity($(this).data('pid'))
		});
	$('.jfb-city .close').tap(function(){
		$('.jfb-city').hide();
		$('.jfb-city .city-box').height(0);
	});
	$('.del span').tap(function(){
		$('.jfb-modal').show()
			.tap(function(e){
				if(e.target === $(".jfb-modal .agree")[0]){
					$.ajax({
						url:'./data/remoAddress.php',
						data:{aid:aid},
						type:'get',
						success:function(data){
							if(data === "ok"){
								window.location.href = './mysite.html';
							}
						}
					})
				}else{
					$(this).hide();
				}
			});


	});
	$('.is-default').tap(function(){
		if($(this).attr('data-d') == 0){
			$(this)
				.attr('data-d', '1')
				.find('i')
				.html('&#xe914;')
				.css('color', '#028ce8')
		}else{
			$(this)
				.attr('data-d', '0')
				.find('i')
				.html('&#xe913;')
				.css('color', '#616161')
		}
	});
	$('#submit').tap(function(){
		if(consignee && cellphone && province && address){
			$.ajax({
				url:'./data/updataAddress.php',
				data:{
					consignee:consignee,
					cellphone:cellphone,
					province:province,
					city:city,
					county:county,
					address:address,
					aid:aid,
					is_default:$('.input-box .is-default').data('d')
				},
				type:'post',
				success:function(data){
					if(data =='ok'){
						window.location.href='./mysite.html'
					}
				}
			})
		}
	});


	function bindcity(pid){
		$.ajax({
			url:'./data/getCity.php',
			data:{pid:pid},
			dataType:"json",
			type:'post',
			success:function(data){
				if(data.length != 0){
					var temp = '<li data-pid="#{id}" data-type="#{type}">#{cityname}</li>';
					C('#citys-list').bindHtml(temp, data);
				}else{
					$('.jfb-city .city-box .sele').hide();

					$('#citys-list').html('');
				}
			}
		});
	}

}();