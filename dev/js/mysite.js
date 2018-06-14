"use strict";

~function(){
	//获取地址信息
	$.ajax({
		url:'./data/getAddress.php',
		type:'post',
		dataType:"json",
		success:function(data){
			console.log(data);
			var box = $(".site-box .site-list");
			var temp='<div class="item-tip"><span class="short-name"></span></div> <div class="item-txt"><p class="header"><span class="consignee">#{consignee}</span><span class="cellphone">#{cellphone}</span> </p> <p class="address">#{province}#{city}#{county}#{address}</p></div> <div class="item-btn"><a href="./addaddress.html?aid=#{aid}">编辑</a></div>';

			for(var i=0,len=data.length;i<len;i++){
				var obj=data[i];
				var dom=$('<li class="site-item"></li>');
				dom.html(C.tempStr(temp,obj));
				if(obj.is_default==1){
					dom.find('.address').addClass('default')
				}
				dom.find('.short-name').html(obj.consignee.slice(0,1));
				box.append(dom);
			}

		}
	});
}();