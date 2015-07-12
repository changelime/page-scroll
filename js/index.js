(function(){
var count = $(".page").length;
var width = $(window).width();
var height = $(window).height();
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
var getShots = function(index){
	html2canvas($(".page")[index], {
		onrendered: function(canvas) {
			var leftCanvas = canvas;
          	var rightCanvas = cloneCanvas(canvas);
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
			$(".page").eq(index).append('<img class="imgLeft" src="'+leftCanvas.toDataURL()+'" />');
			$(".page").eq(index).append('<img class="imgRight" src="'+rightCanvas.toDataURL()+'" />');   
		}
	});
};
var printShots = function(){
	width = $(window).width();
	height = $(window).height();
	$(".page img").remove();
	for(var i = 0; i<count-1; i++)
		getShots(i);
};
printShots();
/*
  绑定事件
*/
(function(){
  var index = 0;
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
  $(window).on("resize", null, printShots);
  $("body").on("mousewheel", null, function(event){
    var flag = canRun();
    var d = event.deltaY;
    var page = null;
    if( flag && d < 0 && index < (count-1))//向下滚动index递增
    {
      page =  $(".page").eq(index++);
      page.find(".content").css("display","none");
      page.addClass("pageOut");
      setTimeout(function(){
        page.css("display","none");
      },1000);
    }
    else if( flag && d > 0 && index > 0)//向上滚动index递减
    {
      page =  $(".page").eq(--index);
      page.css("display","block");
      setTimeout(function(){
        page.removeClass("pageOut");
      },20);
      setTimeout(function(){
        page.find(".content").css("display","block");
      },1000);
    }
  });
}());

}($));