$(document).ready(function() {
var count = $(".page").length;
var width = $(window).width();
var height = $(window).height();
var pageIndex = 0;
/*
  截取图像
*/
var cloneCanvas = function(canvas){
	var item = document.createElement("canvas");
	var context = item.getContext("2d");
	item.width = width;
	item.height = height;
	context.drawImage(canvas, 0, 0);
	return item;
};
var clip = function(item, lineTo){
	var ctx = item.getContext("2d");
	ctx.beginPath();
	lineTo(ctx);
	ctx.globalCompositeOperation = "destination-out";
	ctx.fill();
};
var IsDone = (function(){
	function IsDone(){
		this.count = 0;
		this.waiting = false;
	}
	IsDone.prototype.done = function() {
		this.count = (this.count+1) % ($(".page").length -1);
		if(this.count === 0)
		{
			this.waiting = false;
			$("#flag").text("计算完成");
		}
		else
			$("#flag").text("计算中：" + this.count);
	};
	IsDone.prototype.isDone = function(){
		if(this.count === 0)
			return true;
		else
			return false;
	};
	return new IsDone();
}());
var getShots = function(index, sigle){
	html2canvas($(".page")[index], {
		onrendered: function(leftCanvas) {
          	var rightCanvas = cloneCanvas(leftCanvas);
          	var page = $(".page").eq(index);
			clip(leftCanvas, function(ctx){//把右边三角切掉！
				ctx.moveTo(0, height);
				ctx.lineTo(width, 0);
				ctx.lineTo(width, height);
				ctx.lineTo(0, height);
			});
			clip(rightCanvas, function(ctx){//把左边三角切掉！
				ctx.moveTo(0, 0);
				ctx.lineTo(width, 0);
				ctx.lineTo(0, height);
				ctx.lineTo(0, 0);
			});
			page.append($(leftCanvas).addClass("canvasLeft"));
			page.append($(rightCanvas).addClass("canvasRight"));   
			!sigle&&IsDone.done();
		}
	});
};
var printShots = function(){
	width = $(window).width();
	height = $(window).height();
	$(".page").removeClass("pageOut");
	$(".page").css({"display":"block"});
	$(".page>.content").css({"display":"block"});
	$(".page canvas").remove();
	pageIndex = 0;
	for(var i = 0; i<count-1; i++)
		getShots(i, false);
};
printShots();
/*
  绑定事件
*/
(function(){
	var canRun = (function(){
		var time = new Date().getTime();
		var canRun = function(){
			var now = new Date().getTime();
			if( now - time > 1200 )
			{
				time = now;
				return true;
			}
			else
				return false;
		};
		return canRun;
	}());
	var id = 0;
	$(window).on("resize", null, function(event){
		$("#flag").text("等待重新计算");
		IsDone.waiting = true;
		clearTimeout(id);
		id = setTimeout(function(){
			if(IsDone.isDone())
				printShots();
		},1500);
	});
	var confirm = function(){
		var page = $(".page").eq(pageIndex);
		var canvas = page.find("canvas");
		if( canvas[0].width !== canvas[1].width && canvas[0].width !== width )
		{
			canvas.remove();
			getShots(pageIndex, true);
		}
	};
	$("body").on("mousewheel", null, function(event){
		var flag = canRun();
		var d = event.deltaY;
		var page = null;
		if( !IsDone.waiting && IsDone.isDone() && flag && d < 0 && pageIndex < (count-1))//向下滚动index递增
		{
			page =  $(".page").eq(pageIndex++);
			page.find(".content").css("display","none");
			page.addClass("pageOut");
			setTimeout(function(){
				page.css("display","none");
			},1000);
		}
		else if( !IsDone.waiting &&  IsDone.isDone() && flag && d > 0 && pageIndex > 0)//向上滚动index递减
		{
			page =  $(".page").eq(--pageIndex);
			page.css("display","block");
			setTimeout(function(){
				page.removeClass("pageOut");
			},20);
			setTimeout(function(){
				page.find(".content").css("display","block");
			},1000);
		}
		confirm();
	});
}());

});