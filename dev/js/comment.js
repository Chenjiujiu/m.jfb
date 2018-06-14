"use strict";

//评论对象
function Comment(fid){
	this.fid = fid;
	this.pno = 1;
	this.num = 5;
	this.scrollflag = false;
	this.init();
}
Comment.prototype = {
	init:function(){
		this.setMoreHref();
		this.getgrade();
		this.getcomment();
		this.getmorecomm();
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
	},
	getmorecomm:function(){
		var that = this;
		$(window).on('scroll', function(){
			if(that.scrollflag){
				var top = $('#loding').offset().top - $(window).height();
				if($(window).scrollTop() >= top){
					that.scrollflag = false;
					that.pno++;
					that.getcomment();
				}
			}
		});
	}

};

//截取url参数
var fid = C.getserch("fid");

var comment = new Comment(fid);




