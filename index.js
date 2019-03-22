function createData(a, b, oUl, boom) {
  var arr = [];
  arr.boom = boom;
  arr.boom1 = boom;
  arr.total = a * b;
  for(var i = 0; i < a; i++) {
    arr[i] = [];
    var item = arr[i];
    for(var j = 0; j < b; j++) {
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
          var oDiv = dom.getElementsByTagName('div');
          it.front = oDiv[0];
          it.up = oDiv[1];
          it.left = oDiv[2];
          it.right = oDiv[3];
          it.down = oDiv[4];
          it.back = oDiv[5];
          it.front.item = it;
          it.up.item = it;
          it.left.item = it;
          it.right.item = it;
          it.down.item = it;
          it.back.item = it;
          
      oUl.appendChild(dom);
      it.tag = 0;
      it.y = i;
      it.x = j;
      it.noClick = true;
      dom.item = it;
      it.count = 0;
    }
  }
  return arr
}

function returnRandom(a) {
  return Math.floor(Math.random() * a);
}

function aniDelay(div, time) { //  设置div的延迟
  div.style.animationDelay = time + "s";
}

function changeClassName(div, str, rex) { // 用来切换类名
  var str = " " + str;
  var claName = div.className;
  var rex = rex || "";
  claName = claName.replace(rex, '') + str;
  div.className = claName;
}

function returnRandomNum(a, b) { // 生成随机正整数
  return Math.round(Math.random() * (b - a)) + a;
}

function createLei(a, b, boom, arr) {
  while(boom) {
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

function forQEach(arr, fn) {
  var lenI = arr.length;
  var lenJ = arr[0].length;
  for(var i = 0; i < lenI; i++) {
    for(var j = 0; j < lenJ; j++) {
      fn(arr[i][j], i, j)
    }
  }
}

function forZEach(arr, i, j, fn) {
  for(var p = i - 1; p <= i + 1; p++) {
    for(var q = j - 1; q <= j + 1; q++) {
      if(!arr[p] || !arr[p][q]) {
        continue
      }
      fn(arr[p][q], p, q);
    }
  }
}

function createNumber(arr) {
  forQEach(arr, function(item, i, j) {
    if(item.tag == 9) {
      forZEach(arr, i, j, function(item1) {
        if(typeof item1 !== "undefined" && item1.tag !== 9) {
          item1.tag += 1;
        }
      })
    }
  })
}

function start(item, arr) { // 翻转函数 + 扩散函数
  if(item.noClick) {
    item.noClick = false;
    arr.total = arr.total - 1;
    var dom = item.dom;
//  var back = dom.lastElementChild;
    var tag = item.tag;

    changeClassName(dom, "turn1", /(turnDown|turnRight)/gm);
     if(tag == 0) {

      dom.addEventListener('webkitAnimationEnd', function() {
        dom.removeEventListener('webkitAnimationEnd', arguments.callee);
        forZEach(arr, item.y, item.x, function(item, i, j) {
          start(item, arr);
        })
      }, null);


    } else if(tag == 9) {
      
      forQEach(arr, function(item, i, j) {
        if(item.noClick) {
          item.noClick = false;
          var dom = item.dom;
          changeClassName(dom, "turnOver", "");
        }

      });
      clearInterval(getTimeStr.timer); // 用来终止计时器
      alert("game over");
    }
    if(arr.total == arr.boom1) {
      alert("恭喜你找到全部的雷");
    }
  }
}



function bindEvent(oUl, arr) {
  var clickHandle = (function () {
    var rex = /(front|right|down)/;
  	return function(e) {
      var dom = e.target;
      if(rex.test(dom.className)) {
        var item = dom.item;
        if(item.noClick) {
          start(item, arr);
        }
      }
    }
  })();
  oUl.addEventListener('click', clickHandle, null);
  document.oncontextmenu = function(e) { // 全局范围取消右键默认事件
    e.preventDefault();
  }
  var contextHandle = (function () {
    var rex = /(front|right|down)/;
  	var turnDown = /turnDown/;
  	var turnRight = /turnRight/;
    return function (e) {// 发现这个反应很卡顿
    var front = e.target;
    if(rex.test(front.className)) {// 
      var item = front.item;
      var dom = item.dom;
      var boom = arr.boom;
      var claName = dom.className;
      if(item.noClick) {
        if(item.count == 1) {
          item.count = 2;
            changeClassName(dom, "turnRight", "turnDown");
            boom = boom + 1;
        } else if (item.count == 2) {
          item.count = 0;
            changeClassName(dom, "", /(turnDown|turnRight)/gm);
        } else {
            changeClassName(dom, "turnDown", "turnRight");
            boom = boom - 1;
            item.count = 1;
        }
        arr.boom = boom;
        showBoomDom.innerText = boom;

      }
    }
  }
  })()
  oUl.addEventListener('contextmenu', contextHandle,null)
}

function getTheNumber (arr) {
	
	forQEach(arr, function(item, i, j) {
	  var back = item.back;
	  var tag = item.tag;
    changeClassName(back, "a" + tag, "");
	  
	  item.right.innerText = "?";
	  item.down.innerText = "✖";
	  if (tag > 0 && tag < 9) {
	  	back.innerText = tag;
	  } else if (tag == 9) {
	    back.innerText = "☸";
	  }
	  
	})
}

function init(x, y, boom) {
  document.getElementsByTagName('ul')[0] && document.getElementsByTagName('ul')[0].remove();
  var oUl = document.createElement('ul');
  document.getElementsByClassName('fakeBody2')[0].appendChild(oUl);
  var arr = createData(y, x, oUl, boom);
  createLei(y, x, boom, arr);
  createNumber(arr);
  getTheNumber(arr);
  bindEvent(oUl, arr);
  resizeLi(data.row, data.column, data.dir);
  showBoom(showBoomDom,data.boom);
}

var restartDom = document.getElementsByClassName('restart')[0];
var showTimeDom = document.getElementsByClassName('showTime')[0];
var showBoomDom = document.getElementsByClassName('showBoom')[0];

restartDom.addEventListener('click', function(e) {
  init(data.row, data.column, data.boom);
  getTimeStr(showTimeDom);
})

function showBoom(div, str) {
  div.innerText = str;
}

function getTimeStr(div) {
  clearInterval(getTimeStr.timer);
  var time = new Date().getTime();
  getTimeStr.timer = setInterval(function() {
    var millionS = new Date().getTime() - time;
    var second = Math.floor(millionS / 1000);
    var secondStr = second % 60;
    var min = Math.floor(second / 60);
    secondStr = ("0" + secondStr).slice(-2);
    minStr = ("000" + min).slice(2);
    var str = minStr + ":" + secondStr;
    div.innerText = str;
  }, 200)
}

var optionsDom = document.getElementsByClassName('options')[0];
var rowDom = document.getElementById('row');
var columnDom = document.getElementById('column');
var boomDom = document.getElementById('boom');

var menuDom = document.getElementsByClassName('menu')[0] || document.getElementsByClassName('menuD')[0];
var changeDirDom = document.getElementsByClassName('changeDir')[0];
var optionButtonDom = document.getElementsByClassName('optionButton')[0];

var data = {
  row: 9,
  column: 9,
  boom: 10,
  dir: true // 用来表示方向
}
var fun = {
  '高级': function() {
    data.row = 30;
    data.column = 16;
    data.boom = 99;
    rowDom.value = 30;
    columnDom.value = 16;
    boomDom.value = 99;
  },
  '中级': function() {
    data.row = 16;
    data.column = 16;
    data.boom = 40;
    rowDom.value = 16;
    columnDom.value = 16;
    boomDom.value = 40;
  },
  '简单': function() {
    data.row = 9;
    data.column = 9;
    data.boom = 10;
    rowDom.value = 9;
    columnDom.value = 9;
    boomDom.value = 10;
  },
  '开始游戏': function() {
    init(data.row, data.column, data.boom);
    getTimeStr(showTimeDom);
    optionsDom.parentElement.style.display = "none"; // 配置选项窗口消失
  }
}

optionsDom.addEventListener('click', function(e) {
  var dom = e.target;
  if(dom.tagName == "BUTTON") {
    var inText = dom.innerText;
    fun[inText]();
  }
})

//changeDirDom.addEventListener('click', function(e) {
//console.log(data.row, data.column, data.dir);
//data.dir = !data.dir;
//if(data.dir) {
//  changeDirDom.innerText = "竖屏"
//  menuDom.className = "menu";
//  document.body.style.transform = "rotate(0deg)";
//} else {
//  changeDirDom.innerText = "横屏"
//  menuDom.className = "menuD";
//  document.body.style.transform = "rotate(90deg)";
//}
//resizeLi(data.row, data.column, !data.dir);
//})

optionButtonDom.addEventListener('click', function(e) {
  // 让option 屏显示
  optionsDom.parentElement.style.display = "block";
})

rowDom.addEventListener('input', function() {
  var val = parseInt(this.value);
  if(!!val == 0) {
    val = 0;
  }
  val = val < 10 ? 10 : (val > 30 ? 30 : val);
})
columnDom.addEventListener('input', function() {
  var val = parseInt(this.value);
  if(!!val == 0) {
    val = 0;
  }
  val = val < 10 ? 10 : (val > 30 ? 30 : val);
})
boomDom.addEventListener('input', function() {
  var val = parseInt(this.value);
  if(!!val == 0) {
    val = 0;
  }
  val = val < 10 ? 10 : (val > 99 ? 99 : val);
})

function resizeLi(x, y, dir) { // 严格来讲, 由于格子要保持方形, 所以y值似乎没用.
  var liArr = [].slice.call(document.getElementsByTagName('li'));
  var oUl = document.getElementsByTagName('ul')[0];
  var body = document.body;
  if(dir) { // 横屏时
    var widthB = window.innerWidth * 0.6;
    var heightB = window.innerHeight * 0.9;
  } else { // 竖屏时
    var widthB = window.innerHeight * 0.9;
    var heightB = window.innerWidth * 0.9;
  }
  var width = widthB / x;
  if(width * y > heightB) {
    width = heightB / y;
  };

  oUl.style.width = width * x + 'px';
  oUl.style.height = width * y + 'px';
  liArr.forEach(function(item) {
    item.style.width = width + "px";
    item.style.height = width + "px";
    item.style.lineHeight = width + 'px'; // 用来让文字居中.
    item.item.front.style.transform = " rotateX(0deg) translateZ(" + width / 2 + "px) ";
    item.item.back.style.transform = " rotateX(180deg) rotateZ(180deg) translateZ(" + width / 2 + "px) ";
    item.item.up.style.transform = " rotateX(90deg) translateZ(" + width / 2 + "px) ";
    item.item.down.style.transform = " rotateX(-90deg) translateZ(" + width / 2 + "px) ";
    item.item.left.style.transform = " rotateY(-90deg) translateZ(" + width / 2 + "px) ";
    item.item.right.style.transform = " rotateY(90deg) translateZ(" + width / 2 + "px) ";
  })

}

document.body.onresize = function() {
  resizeLi(data.row, data.column, data.dir)
}