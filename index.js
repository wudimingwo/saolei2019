
function createData (a,b,oUl,boom) {
	var arr = [];
	arr.boom = boom;
	arr.boom1 = boom;
	arr.total = a * b;
	for(var i = 0; i < a ; i++) {
	  arr[i] = [];
	  var item = arr[i];
	  for(var j = 0 ; j < b ; j++) {
	    var it = item[j] = {};
	    it.dom = document.createElement('li');
	    var dom = it.dom;
	    dom.className = "son";
	    dom.innerHTML = `<div class="front"></div>
          <div class="up"></div>
          <div class="left"></div>
          <div class="right"></div>
          <div class="down"></div>
          <div class="back"></div>`;
	    oUl.appendChild(dom);
	    it.tag = 0; 
	    it.y = i;
	    it.x = j;
	    it.noClick = true;
	    dom.item = it;
	  }
	}
	return arr
}

function returnRandom (a) {
	return Math.floor(Math.random() * a);
}

            function aniDelay (div,time) {//  设置div的延迟
              div.style.animationDelay = time + "s";
            }

            function changeClassName (div,str,rex) {// 用来切换类名
              var str = " " + str; 
              var claName = div.className;
              var rex = rex || "";
              claName = claName.replace(rex,'') + str;
              div.className = claName;
            }
           function returnRandomNum (a,b) {// 生成随机正整数
              return Math.round(Math.random() * (b - a)) + a;
            }
           
           
           

function createLei (a,b,boom,arr) {
	while (boom) {
	  var i = returnRandom(a);
	  var j = returnRandom(b);
	  var item = arr[i][j];
	  if(item.tag == 9) {
	    continue
	  }
	  item.tag = 9;
	  boom--;
	}
}


function forQEach (arr,fn) {
	var lenI = arr.length;
	var lenJ = arr[0].length;
	for(var i = 0; i < lenI; i++) {
	  for(var j = 0; j < lenJ ; j++) {
	    fn(arr[i][j],i,j)
	  }
	}
}


function forZEach (arr,i,j,fn) {
	for(var p = i - 1; p <= i + 1; p++) {
        for(var q = j - 1; q <= j + 1; q++) {
          if ( !arr[p] || !arr[p][q]) {
            continue
          }
          fn(arr[p][q],p,q);
        }
      }
}


function createNumber (arr) {
	forQEach(arr,function (item,i,j) {
		if(item.tag == 9) {
		  forZEach(arr,i,j,function (item1) {
		  	if (typeof item1 !== "undefined" && item1.tag !== 9) {
		  	  item1.tag += 1;
		  	}
		  })
		}
	})
}





function start (item,arr) {// 翻转函数 + 扩散函数
  if (item.noClick) {
    item.noClick = false;
    arr.total--;
    var dom = item.dom;
    var back = dom.lastElementChild;
  	var tag = item.tag;
  	claName = 'a' + tag;// a 系列的tag , 应该给back元素, 而不是son元素.
  	
  	// 应该给翻转的类名. // 暂时用最简单的方案.
  	  changeClassName(dom,"turn1","");
  	// 然后要监听是否完成, 完成之后, 要添加round1
//	back.addEventListener("animationend",function () {
//		this.removeEventListener("animationend",arguments.callee,null);
  		//此处只需要更改, 动画名
//		this.style.animationName = "round1";
//	},null);
  	
  	
  	//点击数字时
  	if (tag > 0 && tag < 9) {
  	  // 如何从son 找到back? 可以用 lastElementChild, 不能直接替换, 而是增加.
  	  changeClassName(dom,claName,"");
//	  back.className = claName;
  	  back.innerText = item.tag;
  	} else if (tag == 0) {
  	  // 点击 空白区域时, 扩散
//	  dom.className = claName;
      changeClassName(dom,claName,"");
  	  // 进行扩散运算
  	  forZEach(arr,item.y,item.x,function (item,i,j) {
  	    start(item,arr);
  	  })
  	} else if (tag == 9) {
  	  changeClassName(dom,"a10","");
//	  dom.className = "a10";
  	  back.innerText = "☸"; 
  	  
  	  
  	  forQEach(arr,function (item,i,j) {
  	    if (item.noClick) {
  	      item.noClick = false;
//	      b.className = 'a' + item.tag;
  	      var dom = item.dom;
    var back = dom.lastElementChild;
  	  changeClassName(dom,"turn1","");
    changeClassName(back,'a' + item.tag,"");
  	      if (item.tag < 9) {
  	        back.innerText = item.tag; 
  	      } else{
  	        back.innerText = "☸"; 
  	      }
  	    } 
  	    
  	  });
  	  clearInterval(getTimeStr.timer);// 用来终止计时器
  	  alert("game over");
  	}
  	if (arr.total == arr.boom1) {
  		alert("恭喜你找到全部的雷");
  	}
  }
  	
}

function bindEvent (oUl,arr) {
  oUl.addEventListener('click',function (e) {
    // 这里就不能用target == Li了 因为target 应该变成了div.
  var dom = e.target;
   if ((dom.className.indexOf("front") != -1)) {
    var item = dom.parentNode.item;
    if (item.noClick) {
    	start(item,arr);
    	// 要干什么?
    	// 添加彻底翻转和周围翻转
    }
   }
  },null);
	document.oncontextmenu = function (e) {// 全局范围取消右键默认事件
	  e.preventDefault();
	}
	
	oUl.addEventListener('contextmenu',function (e) {
	  var dom = e.target;
   if (dom.className.indexOf("front") != -1) {
     console.log(123);
     var item = dom.parentNode.item;
     if (item.noClick) {
     	if (typeof item.count == "undefined") {
     		item.count = 0;
     	}
     	switch (item.count%3){
     		case 0:
     		 dom.innerText = "✖";
//   		  dom.className = "mark";
     		  changeClassName(dom,"mark",""); 
     		  item.count += 1;
     		  showBoom (showBoomDom,--arr.boom)
     			break;
     		case 1: 
     		 dom.innerText = "？";
//   		  dom.className = "que";
     		  changeClassName(dom,"que","mark"); 
     		  item.count += 1;
     		  showBoom (showBoomDom,++arr.boom);
     		 break;
     		default:
     		 dom.innerText = "";
//   		  dom.className = "";
     		  changeClassName(dom,"","que"); 
        
     		  item.count += 1;
     			break;
     	}
     	
     }
	  }
	})
}


function init (x,y,boom) {
  document.getElementsByTagName('ul')[0] && document.getElementsByTagName('ul')[0].remove(); 
  var oUl = document.createElement('ul');
  document.getElementsByClassName('fakeBody2')[0].appendChild(oUl);
  var arr = createData(y,x,oUl,boom);
  createLei(y,x,boom,arr);
  createNumber(arr);
  bindEvent(oUl,arr);
  resizeLi(data.row,data.column,data.dir);
}



var restartDom = document.getElementsByClassName('restart')[0];
var showTimeDom = document.getElementsByClassName('showTime')[0];
var showBoomDom = document.getElementsByClassName('showBoom')[0];


restartDom.addEventListener('click',function (e) {
	init(data.row,data.column,data.boom);
	getTimeStr(showTimeDom);
})


function showBoom (div,str) {
	div.innerText = str;
}




function getTimeStr (div) {
  clearInterval(getTimeStr.timer);
  var time = new Date().getTime();
	getTimeStr.timer = setInterval(function () {
		var millionS = new Date().getTime() - time;
		var second = Math.floor(millionS / 1000);
		var secondStr = second%60;
		var min = Math.floor(second/60);
		secondStr = ("0" + secondStr).slice(-2);
		minStr = ("000" + min).slice(2);
		var str = minStr + ":" + secondStr;
		div.innerText = str;
	},200)
}


var optionsDom = document.getElementsByClassName('options')[0];
var rowDom = document.getElementById('row');
var columnDom = document.getElementById('column');
var boomDom = document.getElementById('boom');

var menuDom = document.getElementsByClassName('menu')[0] || document.getElementsByClassName('menuD')[0]; 
var changeDirDom = document.getElementsByClassName('changeDir')[0];
var optionButtonDom = document.getElementsByClassName('optionButton')[0];

var data = {
  row : 30,
  column : 16,
  boom : 99,
  dir : true // 用来表示方向
}
var fun = {
  '高级' : function () {
  	data.row = 30;
  	data.column = 16;
  	data.boom = 99;
  	rowDom.value = 30;
  	columnDom.value = 16;
  	boomDom.value = 99;
  },
  '中级' : function () {
    data.row = 16;
    data.column = 16;
    data.boom = 40;
    rowDom.value = 16;
    columnDom.value = 16;
    boomDom.value = 40;  	
  },
  '简单' : function () {
    data.row = 9;
    data.column = 9;
    data.boom = 10;
    rowDom.value = 9;
    columnDom.value = 9;
    boomDom.value = 10;  	
  },
  '开始游戏' : function () {
  	init(data.row,data.column,data.boom);
	  getTimeStr(showTimeDom);
  	optionsDom.parentElement.style.display = "none";// 配置选项窗口消失
  }
}


optionsDom.addEventListener('click',function (e) {
	var dom = e.target;
	if (dom.tagName == "BUTTON") {
	  var inText = dom.innerText;
	  fun[inText]();
	}
})

changeDirDom.addEventListener('click',function (e) {
  console.log(data.row,data.column,data.dir);
	data.dir = !data.dir;
	if (data.dir) {
		changeDirDom.innerText = "竖屏"
		menuDom.className = "menu";
		document.body.style.transform = "rotate(0deg)";
	} else{
	  changeDirDom.innerText = "横屏"
	  menuDom.className = "menuD";
	  document.body.style.transform = "rotate(90deg)";
	}
	resizeLi(data.row,data.column,!data.dir);
})

optionButtonDom.addEventListener('click',function (e) {
  // 让option 屏显示
optionsDom.parentElement.style.display = "block";})



rowDom.addEventListener('input',function () {
  var val =  parseInt(this.value);
  if (!!val == 0) {
  	val = 0;
  }
  val = val < 10 ? 10 : (val > 30 ? 30 : val);
})
columnDom.addEventListener('input',function () {
  var val =  parseInt(this.value);
  if (!!val == 0) {
  	val = 0;
  }
  val = val < 10 ? 10 : (val > 30 ? 30 : val);
})
boomDom.addEventListener('input',function () {
  var val =  parseInt(this.value);
  if (!!val == 0) {
  	val = 0;
  }
  val = val < 10 ? 10 : (val > 99 ? 99 : val);
})

function resizeLi (x,y,dir) {// 严格来讲, 由于格子要保持方形, 所以y值似乎没用.
	var liArr = [].slice.call(document.getElementsByTagName('li'));
	var oUl = document.getElementsByTagName('ul')[0];
	var body = document.body;
	if (dir) {// 横屏时
	  var widthB = window.innerWidth * 0.6; 
	  var heightB = window.innerHeight * 0.9; 
	} else{ // 竖屏时
	  var widthB = window.innerHeight  * 0.9; 
	  var heightB = window.innerWidth * 0.9; 
	}
	var width = widthB / x;
	if(width * y > heightB) {
	  width = heightB / y;
	};
	
	
	oUl.style.width = width * x + 'px';
	oUl.style.height = width * y + 'px';
	liArr.forEach(function (item) {
		item.style.width = width + "px";
		item.style.height = width + "px";
		item.style.lineHeight = width + 'px';// 用来让文字居中.
	})
	// 我特么就是这么刚,(不过下回弄响应式, 我绝对会优先选择, rem)
	var front = document.getElementsByClassName('front');
	var back = document.getElementsByClassName('back');
	var up = document.getElementsByClassName('up');
	var down = document.getElementsByClassName('down');
	var left = document.getElementsByClassName('left');
	var right = document.getElementsByClassName('right');
	
	for(var i = 0 ; i < front.length; i++) {
	  front[i].style.transform = " rotateX(0deg) translateZ("+ width/ 2 +"px) ";
	  back[i].style.transform = " rotateX(180deg) rotateZ(180deg) translateZ("+ width/ 2 +"px) ";
	  up[i].style.transform = " rotateX(90deg) translateZ("+ width/ 2 +"px) ";
	  down[i].style.transform = " rotateX(-90deg) translateZ("+ width/ 2 +"px) ";
	  left[i].style.transform = " rotateY(-90deg) translateZ("+ width/ 2 +"px) ";
	  right[i].style.transform = " rotateY(90deg) translateZ("+ width/ 2 +"px) ";
	  
	  
	}
	
}

document.body.onresize = function () {
	resizeLi(data.row,data.column,data.dir)
}

