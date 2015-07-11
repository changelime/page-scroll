(function(){
var count = $(".page").length;
/*
  截取图像
*/
html2canvas(document.body, {
  onrendered: function(canvas) {
    $(".page").css({
      "position":"absolute"
    });
    $(".wrapper").css({
      "height":"100vh"
    });
    var getCanvas = function(y, width, height){
      var item = document.createElement("canvas");
      var context = item.getContext("2d");
      item.width = width;
      item.height = height;
      context.drawImage(canvas, 0, y, width, height, 0, 0, width, height);
      return item;
    };
    var clip = function(item, lineTo){
      var ctx = item.getContext("2d");
      ctx.beginPath();
      lineTo(ctx);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
    };
    var width = $(window).width();
    var height = $(window).height();
    for(var i = 0; i<(count-1); i++)
    {
      (function(i){
          var y = i * height;
          var leftCanvas = getCanvas(y, width, height);
          var rightCanvas = getCanvas(y, width, height);
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
          $(".page").eq(i).append('<img class="imgLeft" src="'+leftCanvas.toDataURL()+'" />');
          $(".page").eq(i).append('<img class="imgRight" src="'+rightCanvas.toDataURL()+'" />');   
      }(i));
    }
  }
});
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