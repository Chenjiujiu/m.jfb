"use strict";

// 搜索框盒子对象
function SearchBox(k){
	this.keywords = k;
	this.pno = 1;
	this.nums = 5;
	this.dom = C("<div></div>");
	this.init();
}
SearchBox.prototype = {
	//初始化
	init:function(){
		this.getpros();
		this.bindkeyword();
	},
	//获取产品
	getpros:function(){
		var that = this;
		var keywords = JSON.stringify(this.keywords);
		$.ajax({
			url:'./data/search.php',
			type:'post',
			data:{keywords:keywords, pno:that.pno, nums:that.nums},
			dataType:'json',
			success:function(data){
				if(data.type===1&&data.products.length!==0){
					that.data = data;
					$('.pro-box .pro-null').hide();
					that.bindProducts();
				}else if(data.products.length===0){
					$('.pro-box .pro-null').show()
				} 
			}
		});
	},
	//绑定产品
	bindProducts:function(){
		var temp = '<div class="img"><a href="./buy.html?fid=#{fid}"><img src="./images/#{pic}"></a></div><p class="info">#{bname}&nbsp;#{color}&nbsp;#{size}码&nbsp;#{name}</p><h3 class="price"><small>¥</small>#{price}</h3><p class="porom"></p><p class="comm">已有<span>100+</span>条评论</p>';
		var tagtemp = '<span class="porom-item">#{tag}</span>';
		for(var i = 0, len = this.data.products.length; i < len; i++){
			var obj = this.data.products[i];
			var item = C.tempStr(temp, obj);

			var container = $("<li></li>");
			container.addClass('pro-item');
			container.html(item);

			var tags = obj.tag.split('，');
			var tagEl = C.tempStr(tagtemp, tags);
			container.find(".porom").html(tagEl);
			$('.pro-box .pro-list').append(container);
		}
		this.scrollflag = true;
	},
	//绑定关键词
	bindkeyword:function(){
		$(".jfb-header .form input").val(this.keywords)
	}
};


// 页面事件
~function(){
	var keywords = C.getserch().keywords;
	if(keywords){
		keywords = keywords.replace(/\s+/g, " ").split(" ");
		new SearchBox(keywords);
	}
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