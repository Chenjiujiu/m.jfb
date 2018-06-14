"use strict";
//购物车
function Cart(){
	this.products = {};
	this.init();
}
Cart.prototype = {
	init:function(){
		this.getCart();
		this.bindEvent();
		this.gosum();
	},
	//获取购物车数据
	getCart:function(){
		var that = this;
		$.ajax({
			type:"post",
			url:'./data/getCart.php',
			dataType:'json',
			success:callback
		});
		function callback(data){
			console.log(data);

			if(data === 0){
				$(".jfb-safe-tips").hide();
				$(".jfb-sum").hide();
				$(".jfb-cart").hide();
				$(".login-hint").show();
			}else{
				$(".jfb-safe-tips").show();
				$(".jfb-sum").show();
				$(".jfb-cart").show();
				$(".login-hint").hide();
				for(var k in data){
					that.products[k] = new Product(data[k]);
				}
				if(JSON.stringify(that.products) == "{}"){
					var empcar = '<div class="empyCart"><p class="hint-icon"><i class="icon-font">&#xe905;</i></p><p class="hint-txt">购物车空空如也！</p><p class="hint-btn"><a href="./index.html">前往首页选购</a></p></div>';
					$('.jfb-cart .jfb-shop').html(empcar);
					$(".jfb-sum").hide();
				}
			}
		}
	},
	getallnow:function(){
		var allnow = 0;
		for(var k in this.products){
			var obj = this.products[k];
			if(obj.checked){
				allnow += obj.sum;
			}
		}
		return C.float2(allnow);
	},
	getallold:function(){
		var allold = 0;
		for(var k in this.products){
			var obj = this.products[k];
			if(obj.checked){
				allold += obj.delSum;
			}
		}
		return C.float2(allold);
	},
	getalldel:function(){
		var alldel = this.getallold() - this.getallnow();
		return C.float2(alldel);
	},
	updata:function(){
		$(".jfb-sum .sum-info .sum-all").html('合计:￥' + this.getallnow());
		$(".jfb-sum .sum-info .other")
			.html('总:' + this.getallold() + '&nbsp;折:' + this.getalldel());
	},
	bindEvent:function(){
		var that = this;
		// 全选
		$(".jfb-sum .sum-check").tap(function(){
			if($(this).hasClass('checked')){
				$(this).removeClass("checked").find("i").html("&#xe913;");
				for(var k in that.products){
					var obj = that.products[k];
					obj.checked = false;
					obj.dom
						.find(".body-check")
						.removeClass("checked")
						.find("i").html("&#xe913;");
				}
			}else{
				// 自己变成选中
				$(this).addClass("checked").find("i").html("&#xe914;");
				// 遍历所有添加选中
				for(var k in that.products){
					var obj = that.products[k];
					obj.checked = true;
					obj.dom
						.find(".body-check")
						.addClass("checked")
						.find("i").html("&#xe914;");
				}
			}
			that.updata();
		});
	},
	gosum:function(){
		var that = this;
		$('.sum-submit').tap(function(e){
			//提交订单
			var cartlist = [];
			for(var k in that.products){
				if(that.products[k].checked){
					cartlist.push({
						sid:that.products[k].data.sid,
						count:that.products[k].data.num,
						cid:that.products[k].data.carid
					})
				}
			}
			if(cartlist.length === 0){
				return false;
			}else{
				$.ajax({
					url:'./data/addorder.php',
					data:{data:JSON.stringify(cartlist)},
					type:'post',
					success:function(data){
						// location.href = "./order.html"
					}
				});
			}
		})
	}
};

//产品
function Product(data){
	this.data = data;
	this.timer = null;
	this.checked = false;
	this.sum = 0;
	this.delSum = 0;
	this.init();
}
Product.prototype = {
	// 初始化
	init:function(){
		this.sum = this.getsum();
		this.delSum = this.getDelSum();
		this.creatDom();
		this.bindEvent();
		this.bindDom();
	},
	temp:'<div class="body-check"><i class="icon-font">&#xe913;</i></div><div class="body-product clearfix"><a href="./buy.html?fid=#{fid}" class="product-pic"><img src="./images/#{pic}" alt=""></a><div class="product-info"><a href="./buy.html?fid=#{fid}" class="info-desc"><p class="desc">#{name}</p><p class="type"><span>#{color}</span><span>#{size}码</span></p></a><p class="info-price">单价:<small>￥</small>#{price}</p><div class="info-option"><div class="num-box"><span class="redus">-</span><input type="tel" value="#{num}" class="num"><span class="add">+</span> </div> <div class="del-box"><div class="del-top"></div><div class="del-bot"></div></div> </div></div></div>',
	//计算总价
	getsum:function(){
		var sum = parseFloat(this.data.num * this.data.price);
		return C.float2(sum);
	},
	//计算原价价
	getDelSum:function(){
		var delSum = parseFloat(this.data.num * this.data.delprice);
		return C.float2(delSum);
	},
	//绑定数据
	creatDom:function(){
		this.carid = this.data.carid;
		this.dom = $('<div></div>').addClass("shop-body").html(C.tempStr(this.temp, this.data));
	},
	//绑定事件
	bindEvent:function(){
		var that = this;
		var num = this.dom.find('.num');
		// 删除
		this.dom.find('.del-box').tap(function(e){
			that.dom.find('.del-top').addClass('rotate');
			$(".jfb-model").attr('data-id', that.data.sid).show()
				.tap(function(e){
					if(e.target == $(".jfb-model .agree")[0]){
						var id = $(".jfb-model").attr('data-id');
						that.updata(id, 0);
						that.dom.remove();
						delete car.products[that.data.sid];
						C(".jfb-model .model-box").animate({
							targent:{opacity:0},
							fn:function(){
								$('.jfb-model').hide();
								$(".jfb-model .model-box").css('opacity',1);
							}
						});
						that.dom.find('.del-top').removeClass('rotate');
					}else{
						C(".jfb-model .model-box").animate({
							targent:{opacity:0},
							fn:function(){
								$('.jfb-model').hide();
								$(".jfb-model .model-box").css('opacity',1);
							}
						});
						that.dom.find('.del-top').removeClass('rotate');
					}
				});
		});
		// 修改数量
		this.dom.find('.redus').tap(function(e){
			if(num.val() <= 1){
				return false;
			}else{
				that.data.num--;
				num.val(that.data.num);
				clearTimeout(that.timer);
				that.timer = setTimeout(function(){
					that.updata(that.data.sid, num.val());
				}, 200);
			}
		});
		this.dom.find('.add').tap(function(e){
			that.data.num++;
			num.val(that.data.num);
			clearTimeout(that.timer);
			that.timer = setTimeout(function(){
				that.updata(that.data.sid, num.val());
			}, 200);
		});
		num.on('keyup', function(){
			num.val(num.val().replace(/[^\d]/g, ""));
			clearTimeout(that.timer);
			that.timer = setTimeout(function(){
				that.data.num = num.val();
				that.updata(that.data.sid, num.val());
				car.updata();
			}, 500);
		});
		// 选中
		this.dom.find('.body-check').tap(function(){
			if($(this).hasClass("checked")){
				// 清空自己
				$(this).removeClass("checked").find("i").html("&#xe913;");
				//清空全选
				$(".sum-check").removeClass("checked").find("i").html("&#xe913;");
				that.checked = false;
			}else{
				$(this).addClass("checked").find("i").html("&#xe914;");
				that.checked = true;
			}
			car.updata()
		})
	},
	updata:function(sid, num, fn){
		var that = this;
		$.ajax({
			type:"post",
			url:'./data/updata.php',
			data:{sid:sid, num:num},
			success:function(data){
				if(data == 1){
					that.sum = that.getsum();
					that.delSum = that.getDelSum();
					car.updata();
				}else if(data == 0){
					console.log("数据库操作" + data);
				}
			}
		});
	},
	bindDom:function(){
		$('#shopbox').append(this.dom.get(0));
	}
};

var car = new Cart();



