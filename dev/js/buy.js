"use strict";

~function(){

	//截取url参数
	var fid = C.getserch("fid");

	//模态框对象
	function Modal(title, agree, cancel){
		this.EL = $('.jfb-modal');
		this.title = $('.jfb-modal .title');
		this.cancel = $('.jfb-modal .cancel');
		this.agree = $('.jfb-modal .agree');
		this.init();
	}
	Modal.prototype = {
		init:function(){
			var that = this;
			this.cancel.tap(function(){
				that.hide()
			})
		},
		show:function(){
			this.EL.show()
		},
		hide:function(){
			this.EL.hide()
		},
		settxt:function(title, agree, cancel){
			if(agree === 'hide'){
				this.agree.hide()
			}else{
				this.agree.show()
			}
			if(cancel === 'hide'){
				this.cancel.hide();
			}else{
				this.cancel.show()
			}

			this.title.html(title);
			this.agree.html(agree);
			this.cancel.html(cancel);
		},
		sethref:function(agree, cancel){
			agree = agree || 'javascript:;';
			cancel = cancel || 'javascript:;';
			this.agree.attr('href', agree);
			this.cancel.attr('href', cancel);
		}
	};
	var modal = new Modal();

	// 产品对象
	function Product(fid){
		//产品类别
		this.fid = fid;
		this.selcid;
		this.selzid;
		this.num = 1;
		//详细信息
		this.order = {};
		//尺码
		this.size = [];
		//颜色
		this.color = [];
		//产品图片
		this.pic = [];
		//详细图片
		this.order_pic = [];
		//颜色对应的尺码
		this.allZid = [];
	}
	Product.prototype = {
		// 初始化
		init:function(){
			this.bindBacis();
			this.bindPic(this.pic[this.color[0].cid]);
			// this.bindPicEvent();
			this.bindOrderImg();
			this.bindColorEvent();
			this.bindSizeEvent();
			this.bindNumEvent();
			this.infoEvent();
		},

		//dom元素集合
		config:{
			desc:C(".product-desc p"),//标题dom
			price:C(".product-price"),	//价格dom
			promo:C(".product-promo"),	//活动dom
			size_list:C(".product-size ul"),	//尺码dom
			color_list:C(".product-color ul"),	//颜色dom
			order_info:C('.product-info ul'),	//详细参数列表
			show_info_pic:C('.detail'),	//详细列表
			order_pic:C('.detail .img-box'),	//详细图片列表
			pic:C(".product-pic .pic-list"),// 图片容器
			buy_tip:C(".pro-choose .choose-info .buy-tip") //提示
		},

		//模板集合
		temp:{
			//价格模板
			price:'<span class="jfb-price"><small>￥</small>#{price}</span><span class="old-price"><small>￥</small>#{delprice}</span>',
			//活动模板
			promo:'<span>#{tag}</span>',
			//尺码模板
			size_list:'<li data-zid="#{zid}">#{size}</li>',
			//颜色模板
			color_list:'<li data-cid="#{cid}"><img src="./images/#{img}" alt=""><span>#{color}</span></li>',
			//商品详细信息模板
			order_info:'<li><span class="title">品牌：</span><span>#{brand}</span></li><li><span class="title">分类：</span><span>#{type}</span></li><li><span class="title">产地：</span><span>#{origin}</span></li><li><span class="title">性别：</span><span>#{sex}</span></li><li><span class="title">鞋面材质：</span><span>#{trsture}</span></li><li><span class="title">上市时间：</span><span>#{time}</span></li><li><span class="title">鞋帮款式：</span><span>#{height}</span></li><li><span class="title">功能：</span><span>#{fun}</span></li><li><span class="title">闭合方式：</span><span>#{close}</span></li>',
			//商品详细介绍图片模板
			order_pic:'<img src="./images/#{pic}" alt="">',
			pic:'<li><img src="./images/#{m}" alt=""></li>',
		},
		//绑定基本信息
		bindBacis:function(){
			this.config.desc.html(this.order.name);//绑定标题
			this.config.price.bindHtml(this.temp.price, this.order);//绑定价格
			//绑定活动标签
			var promos = this.order.tag.split('，');
			var proHtml = '优惠：';
			if(promos.length == 0){
				proHtml += '暂无活动'
			}else{
				proHtml += C.tempStr(this.temp.promo, promos);
			}
			this.config.promo.html(proHtml);
			//绑定尺码
			this.config.size_list.bindHtml(this.temp.size_list, this.size);
			//绑定颜色
			this.config.color_list.bindHtml(this.temp.color_list, this.color);
			//绑定详细参数
			this.config.order_info.bindHtml(this.temp.order_info, this.order);
		},

		// 绑定图片
		bindPic:function(data){
			this.config.pic.bindHtml(this.temp.pic, data);
			C('.product-pic .page .all').html(data.length)
			this.bindPicEvent();
		},
		bindPicEvent:function(){
			var imgBox = $('.product-pic .pic-list');
			var nowEl = $('.product-pic .page .now');
			var allEl = $('.product-pic .page .all');
			var imgs = imgBox.find('li');
			var width = imgs.offset().width;
			var index = 0,
				all=imgs.length,
				startX = 0,
				endX = 0,
				moveX;
			setDot(index);
			setTransform(0);
			imgBox.on('touchstart', function(e){
				startX = e.touches[0].clientX;
			});

			imgBox.on('touchmove', function(e){
				endX = e.touches[0].clientX;
				moveX = endX - startX;
				removeTransition();
				if(-index * width + moveX>0||-index * width + moveX<-(imgs.length-1) * width ){
					moveX=0;
				}
				setTransform(-index * width + moveX);
			});

			imgBox.on('touchend', function(){
				var moveXabs = Math.abs(moveX);
				if(endX !== 0 && moveXabs >= (width / 3)){
					index -= moveX / moveXabs
				}
				addTransition();
				if(index<=0 ){
					index = 0
				}else if(index >=imgs.length-1) {
					index = imgs.length-1;
				}
				setTransform(-index * width);
				endX = 0;
				setDot(index);
			});

			function setTransform(w){
				imgBox.css('transform', 'translateX(' + w + 'px)');
				imgBox.css('webkitTransform', 'translateX(' + w + 'px)');
			}
			function addTransition (){
				imgBox.css('transition', 'all .5s ease 0s');
				imgBox.css('webkitTransition', 'all .5s ease 0s');
			}
			function removeTransition (){
				imgBox.css('transition', 'none');
				imgBox.css('webkitTransition', 'none');
			}
			function setDot (index){
				nowEl.html(index+1);
			}
		},
		bindOrderImg:function(){
			var top = this.config.show_info_pic.get(0).offsetTop - C.windowH();
			var flag = true;
			C(window).on("scroll", loadImg);
			var that = this;
			function loadImg(){
				if(C.scrollTop() >= top && flag){
					flag = false;
					C(window).un("scroll", loadImg);
					if(that.order_pic.length > 0){
						that.config.order_pic.bindHtml(that.temp.order_pic, that.order_pic)
					}
				}
			}
		},

		//绑定颜色单击事件
		bindColorEvent:function(){
			var that = this;
			var imgBox = $('.product-pic .pic-list');
			var now = $('.product-pic .page .now');
			$('.product-color ul').on('tap', 'li', function(){
				if($(this).hasClass("current")){
					return false;
				}else{
					$(this).siblings().removeClass("current");
					$(this).addClass("current");
					var cid = $(this).attr("data-cid");
					that.selcid = cid;
					that.bindPic(that.pic[cid]);
					that.hasSize(cid)
				}
			})

		},

		//查询对应尺码
		hasSize:function(cid){
			var sizes = this.config.size_list;
			var allZid = this.allZid[cid].allZid;
			sizes.child().addClass("no-size");
			var data = ";" + allZid + ";";
			for(var i = 0, len = sizes.child().leng(); i < len; i++){
				var item = C(sizes.child().get(i));
				var zid = ";" + item.attr("data-zid") + ";";
				if(data.indexOf(zid) !== -1){
					item.remClass("no-size");
				}else{
					if(this.selzid === item.attr("data-zid")){
						this.selzid = null;
						item.remClass("current");
					}
				}
			}
		},

		//参数展开事件
		infoEvent:function(){
			$('.product-info').tap(function(){
				$('.product-info .icon-font').toggleClass('rotate');
				$('.product-info .info-list').toggle()
			})
		},

		//尺码点击事件
		bindSizeEvent:function(){
			var that = this;
			$('.product-size ul').on('tap', 'li', function(){
				if($(this).hasClass("current") || $(this).hasClass("no-size")){
					return false;
				}else{
					var zid = $(this).attr("data-zid");
					that.selzid = zid;
					$(this).siblings().removeClass("current");
					$(this).addClass("current");
				}
			})
		},

		//数量点击事件
		bindNumEvent:function(){
			var num_add = $('.product-nums .num_add a');
			var num_reduce = $('.product-nums .num_reduce a');
			var num_input = $('.product-nums .num_input input');
			var that = this;
			num_reduce.tap(function(){
				if(that.num <= 1){
					num_reduce.parent().addClass('disabled');
					return false;
				}else{
					that.num--;
				}
				num_input.val(that.num);
			});
			num_add.tap(function(){
				that.num++;
				num_input.val(that.num);
				num_reduce.parent().removeClass('disabled')
			});
			num_input.on('keyup', function(){
				var numreg = /[^0-9]+/;
				var num = 1;
				num = this.value.replace(numreg, '');
				if(num == 0 || num == ''){
					num = 1
				}
				this.value = num
			})

		},

		//购买
		buyNow:function(){
			console.log("立即购买");
		},

		// 添加购物车
		add2car:function(){
			var fid = this.fid;
			var cid = this.selcid;
			var zid = this.selzid;
			var num = this.num;
			var that = this;
			if(fid && cid && zid && num){
				$.ajax({
					url:'./data/addcar.php',
					type:'post',
					data:{fid:fid, cid:cid, zid:zid, num:num},
					success:callback
				});
			}else{
				modal.settxt('请选择商品信息', 'hide', '确定');
				modal.sethref(null, null);
				modal.show();
			}
			function callback(data){
				if(data === 'ok'){
					modal.settxt('添加购物车成功！', '前往购物车', '继续购买');
					modal.sethref('./cart.html');
					modal.show();
				}else{
					modal.settxt('操作失败，请重试！', '确定', 'hide');
					modal.sethref(null, null);
					modal.show();
				}
			}

		}
	};
	var product = new Product(fid);

	//评论对象
	function Comment(fid){
		this.fid = fid;
		this.pno = 1;
		this.num = 1;
		this.scrollflag = false;
		this.init();
	}
	Comment.prototype = {
		init:function(){
			this.setMoreHref();
			this.getgrade();
			this.getcomment();
		},
		config:{
			morebtn:$('.comment .comment-more a'),
			Keywords:C('.comment .comment-keywords ul'),
			commlist:C('.comment .comment-list'),
		},
		setMoreHref:function(){
			this.config.morebtn.attr('href', './comment.html?fid=' + this.fid);
		},
		bindKeywords:function(data){
			var temp = '<li class="#{type}"><a href="javascript:;">#{keyword}(#{num})</a></li>';
			this.config.Keywords.bindHtml(temp, data.keyWords)
		},
		bindcommlist:function(data){
			var temp = '<div class="info clearfix"><div class="author">#{author}<i class="anonymous">(#{tag})</i></div><i class="time">2018/04/25 18:32</i></div><div class="content"><p>#{txt}</p><div class="img"><ul class="img-small clearfix"></ul></div><p class="reply"><span>回复：</span>#{reply}</p></div><div class="type"><p>尺码：<span>#{size}</span></p><p>颜色：<span>#{color}</span></p></div>';
			var pictemp = '<li><img src="./images/#{pic}"></li>';
			for(var i = 0, len = data.info.length; i < len; i++){
				var obj = data.info[i];
				var item = C.tempStr(temp, obj);
				var container = $("<li></li>");
				container.addClass('comment-item');
				container.html(item);
				if(obj.reply === null){
					container.find(".reply").hide()
				}
				if(obj.pic === null){
					container.find(".img").hide()
				}else{
					var imgs = obj.pic.split(',');
					var imgEl = C.tempStr(pictemp, imgs);
					container.find(".img-small").html(imgEl)
				}
				$('.comment .comment-list').append(container);
			}
			this.scrollflag = true;
		},
		getgrade:function(){
			var that = this;
			$.ajax({
				url:'./data/getGrade.php',
				type:'post',
				data:{fid:that.fid},
				dataType:"json",
				success:function(data){
					that.bindKeywords(data);
				}
			});
		},
		getcomment:function(){
			var that = this;
			$.ajax({
				url:'./data/getComment.php',
				type:'post',
				data:{fid:fid, pno:that.pno, num:that.num},
				dataType:"json",
				success:function(data){
					that.bindcommlist(data)
				}
			});
		}
	};
	new Comment(fid);

	//获取数据并初始化产品对象
	$.ajax({
		url:'./data/buy.php',
		type:'post',
		data:{"fid":fid},
		dataType:"json",
		success:function(data){
			product.order = data.order;
			product.size = data.allSize;
			product.color = data.allColor;
			product.allZid = data.allZid;
			product.order_pic = data.order_pic;
			product.pic = data.pic;
			product.init();
			//购买按钮
			$("#buynow").tap(function(){
				islogin(function(){
					product.buyNow();
				}, function(){
					modal.settxt('未登录,请先登录', '前往登陆', '继续逛逛');
					modal.sethref('./login.html');
					modal.show();
				});
			});
			//添加购物车
			$("#addcar").tap(function(){
				islogin(function(){
					product.add2car();
				}, function(){
					modal.settxt('未登录,请先登录', '前往登陆', '继续逛逛');
					modal.sethref('./login.html');
					modal.show();
				});
			})
		}
	});

	$('.jfb-topBar .title-product').tap(function(){
		$(window).scrollTop(0)
	});
	$('.jfb-topBar .title-comment').tap(function(){
		var c=$('.comment').offset().top;
		$(window).scrollTop(c-45)
	});
	$('.jfb-topBar .title-detail').tap(function(){
		var d=$('.detail').offset().top;
		$(window).scrollTop(d-45)
	});

}();