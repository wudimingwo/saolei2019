// 生成二维数组
// 先生成dom 元素, 还是先生成 数据?



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
      oUl.appendChild(dom);
      it.tag = 0; // 先进行数字的初始化
      // 把坐标放进去
      it.y = i;
      it.x = j;
      // 是否翻转过
      it.noClick = true;
      // 用来右键点击切换的计数
//      it.count = 0; 算了, 并非每个格子都用, 还是用的时候进行初始化吧
      // 为了通过dom 找到 item, 但这样似乎也不是很好.
      dom.item = it;
    }
  }
  return arr
}

// 返回一个随机正整数
function returnRandom (a) {
  return Math.floor(Math.random() * a);
}

// 生成随机的雷, 用9来进行标记

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

// 封装一个 遍历二维数组的函数

function forQEach (arr,fn) {
  var lenI = arr.length;
  var lenJ = arr[0].length;
  for(var i = 0; i < lenI; i++) {
    for(var j = 0; j < lenJ ; j++) {
      fn(arr[i][j],i,j)
    }
  }
}

// 遍历周边格子

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

// 根据生成的雷, 对其他位置进行数字计算, 用 0-8 进行表示

// 不遍历周边的雷, 而是用另一种方法计算数字.
// 之前的思路是遇到不是雷的格子, 遍历一次周边的格子,
// 现在的思路是遇到雷的格子, 遍历一次周边的格子, 由于大概率上, 雷的数比非雷数要少, 这样应该更节省性能. 

function createNumber (arr) {
  // 进行遍历,获取tag, 如果是 undefined 就进行计算
  forQEach(arr,function (item,i,j) {
    if(item.tag == 9) {
      forZEach(arr,i,j,function (item1) {
        if (typeof item1 !== "undefined" && item1.tag !== 9) {
//          console.log(item1.tag);
          item1.tag += 1;
        }
      })
    }
  })
}

// 到此应该算完成了初始化操作
// 为了检验数据的正确性, 把 数字展现出来.

//forQEach(arr,function (item,i,j) {
//  item.dom.innerText = item.tag;
//  item.dom.className = 'a' + item.tag;
//})


// 现在数据一切正常, 
// 需要对样式做处理, 并且进入交互阶段
// 格子总共有多少种样式? 0-9 起码要有10个样式
// 0 为空, 即, 什么都没有
// 9 为炸弹, 即, 需要弄一个炸点标志
// 1-8 为数字, 起码要有不同的颜色
// 10 : 用来表示默认样式?
// 11 : 用来表示 点击的炸弹.
// 可以考虑, 直接用tag 作为类名.

// 样式这个部分后面再详细写,
// 先把用于交互的基本样式写一下
// 先写核心的交互部分

// 进入交互部分
// 点击时, 我们需要找到dom 对应的 数据.
// 找到tag, 
// 并将相应的样式加上去
// 如果是 0 就进行扩散运算,
// 如果是 9 就gameover

// 绑定事件

function start (item,arr) {// 翻转函数 + 扩散函数
  if (item.noClick) {
    item.noClick = false;
    arr.total--;
    var dom = item.dom;
    var tag = item.tag;
    claName = 'a' + tag;
    //点击数字时
    if (tag > 0 && tag < 9) {
      dom.className = claName;
      dom.innerText = item.tag;
    } else if (tag == 0) {
      // 点击 空白区域时, 扩散
      dom.className = claName;
      // 进行扩散运算
      forZEach(arr,item.y,item.x,function (item,i,j) {
        start(item,arr);
      })
    } else if (tag == 9) {
      // 点击 雷时
      // 遍历数据, 将所有格子的样式全部添加上去
      dom.className = "a10";
      item.dom.innerText = "☸"; 
      
      
      forQEach(arr,function (item,i,j) {
        if (item.noClick) {
          item.noClick = false;
          item.dom.className = 'a' + item.tag;
          if (item.tag < 9) {
            item.dom.innerText = item.tag; 
          } else{
            item.dom.innerText = "☸"; 
          }
        } 
        
      });
      // 用来判定游戏结束
      clearInterval(getTimeStr.timer);// 用来终止计时器
      alert("game over");
      // 很奇怪, 为什么先 alert 再渲染?
    }
    // 用来判定游戏成功
    if (arr.total == arr.boom1) {
      alert("恭喜你找到全部的雷");
    }
  }
    
}

function bindEvent (oUl,arr) {
  oUl.addEventListener('click',function (e) {
  //  console.log(e.target.item.tag);
  var dom = e.target;
   if (dom.tagName == "LI") {
    var item = dom.item;
    if (item.noClick) {
      start(item,arr);
    }
   }
  },null);
  // 右键功能
  document.oncontextmenu = function (e) {// 全局范围取消右键默认事件
    e.preventDefault();
  }
  
  oUl.addEventListener('contextmenu',function (e) {
    // 共有3种状态, 以及2种类名
    // 需要进行切换
    // 第一种思路, 用一个计数器, %3 进行, 但需要给每一个 target, 都来一个计数器属性.
    // 第二种思路, 是根据前一个是什么状态, 选择后一个状态,
    // 我们还是选择第一种思路.
    // 并且把该计数器属性, 也放入 二维数组的数据结构中.
    // 增加类名前, 需要先判断, 是否被点击过, 当没有被点击过时, 才能进行.
    var dom = e.target;
   if (dom.tagName == "LI") {
     var item = dom.item;
     if (item.noClick) {
      // 这上面几句结构, 跟 click 事件好重复啊.
      if (typeof item.count == "undefined") {
        item.count = 0;
      }
      switch (item.count%3){
        case 0:
          // 标记 红旗
         dom.innerText = "✖";
          // 添加 红旗类名
          dom.className = "mark";
          // count + 1
          item.count += 1;
          //减少一个雷
          showBoom (showBoomDom,--arr.boom)
          break;
        case 1: 
        // 标记问号
         dom.innerText = "？";
        // 添加 问号类名
          dom.className = "que";
        // count + 1
          item.count += 1;
          // 增加一个雷
          showBoom (showBoomDom,++arr.boom);
         break;
        default:
        // 清空标记
         dom.innerText = "";
        // 清空类名
          dom.className = "";
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
  document.body.appendChild(oUl);
  var arr = createData(y,x,oUl,boom);
  createLei(y,x,boom,arr);
  createNumber(arr);
  bindEvent(oUl,arr);
  resizeLi(data.row);
}


// 到这里最基本的功能, 以及交互就结束了.

// 需要增加的功能有以下几个
// 右键功能, 需要有三种标记能力

// 右键需要切换类名, 需要额外增加两个类名.


// 重新开启游戏功能

var restartDom = document.getElementsByClassName('restart')[0];
var showTimeDom = document.getElementsByClassName('showTime')[0];
var showBoomDom = document.getElementsByClassName('showBoom')[0];


restartDom.addEventListener('click',function (e) {
  init(data.row,data.column,data.boom);
  getTimeStr(showTimeDom);
})


// 显示剩余雷数的功能

// 首先需要一个用来记录雷数的变量, 这个变量应该是全局变量, 并且, 应该在初始化前可以由用户配置
// 可以考虑将 雷放在 arr 上, 虽然总体来讲不太合适, 但在数据遍历和处理上, 没有影响, 可以试一下
// 当右键标记雷时, boom--, 当右键 取消标记雷时, boom++
// 显示雷数 的函数
function showBoom (div,str) {
  div.innerText = str;
}


// 计时器功能


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

// 行数和列数需要另外输入

// 刚开始不能显示游戏
// 显示选项框
// 高级, 中级, 简单 , 这是上面的三个框
// 中间框是, 行数, 列数, 炸弹数,
// 最下面是游戏开始.
// 这个窗口, 除了在最开始的时候出现, 后续想更改配置时, 也要出现.
// 需要使用display : none;

// 我希望, 在该弹窗出现时, 其他元素都隐藏掉.
// 方法1. 自然是让其他元素全部display none
// 方法2. 我们可以给该弹窗弄一个父级, 大小与body 相同
// 该父级层级比其他的要高, 且不透明时, 后面的元素自然看不到.

// 分析逻辑
// 点击开始游戏时, 将会读取初始数据进行初始化, fakebody 将进入 display : none, 开始正常游戏
// 输入input 框时, 将会更改初始数据, 可用 onchange
// 当点击高级, 中级, 简单时, 会更改 初始数据,为固定的数据, 并且在input 框中展现出来.

// 思路1
// 首先获取3个button, 3个input , 1个 开始button
// 其次, 设定一个初始数据, 可以是一个对象, 为全局变量
// 再次, 开始写 button 事件, 
//input 事件, 
//以及 开始事件

// 思路2
// 只获取 options 元素, 在其身上绑定事件, 通过target, tagName 进行判断, 进而绑定事件.
// 相比思路1 , 优点, 绑定监听的元素较少, 可节省性能, 缺点, 日后维护或者扩展可能不太好?
// 由于此思路稍微显得新颖, 我们试着用此思路
// 不行, 此思路有局限性, 由于事件的类型并非只有click一种, 无法实现所有事件的绑定 

var optionsDom = document.getElementsByClassName('options')[0];
var rowDom = document.getElementById('row');
var columnDom = document.getElementById('column');
var boomDom = document.getElementById('boom');
// 初始数据
var data = {
  row : 30,
  column : 16,
  boom : 99
}
// 要绑定的函数
var fun = {
  '高级' : function () {
    // 更改初始数据
    data.row = 30;
    data.column = 16;
    data.boom = 99;
    // 更改inp 的数据
    rowDom.value = 30;
    columnDom.value = 16;
    boomDom.value = 99;
  },
  '中级' : function () {
    data.row = 16;
    data.column = 16;
    data.boom = 40;
    // 更改inp 的数据
    rowDom.value = 16;
    columnDom.value = 16;
    boomDom.value = 40;   
  },
  '简单' : function () {
    data.row = 9;
    data.column = 9;
    data.boom = 10;
    // 更改inp 的数据
    rowDom.value = 9;
    columnDom.value = 9;
    boomDom.value = 10;   
  },
  '开始游戏' : function () {
    init(data.row,data.column,data.boom);
    getTimeStr(showTimeDom);
    optionsDom.parentElement.style.display = "none";
  }
}

// 绑定事件

optionsDom.addEventListener('click',function (e) {
  // 判断
  var dom = e.target;
  if (dom.tagName == "BUTTON") {
    var inText = dom.innerText;
    fun[inText]();
  }
})

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

// 到这里也没太大问题来了
// 下面的问题是
// 我需要根据行数和列数,进行布局.
// 看看是不是通过更改li的这两个属性就可以达到效果
//   width: calc(80vw / 30);
//  height: calc(80vw / 30);

// 最有效率的方式 应该是增加 类名.
// 但不想给 li 添加类名, 可以考虑给ul 添加类名
// 但这样我要弄20个类名用来切换,
// 所以还是直接获取li, 进行行间样式的更改?  哎.. 好吧, 感觉很暴力
function resizeLi (x,y) {// 严格来讲, 由于格子要保持方形, 所以y值似乎没用.
  var liArr = [].slice.call(document.getElementsByTagName('li'));
  liArr.forEach(function (item) {
    var width = document.getElementsByTagName('ul')[0].offsetWidth / x;
    item.style.width = width + "px";
    item.style.height = width + "px";
  })
}

document.body.onresize = function () {
  resizeLi(data.row,data.column)
}


// 以及显示成功的功能

// 如何判定成功, 
// 方法1.如果雷全部找到, 但这样会存在尝试的余地
// 方法2.除了累之外的所有点都被点击之时.
// 如何判断? 很简单, 知道格子总数, 知道雷的总数,
// 当点击并且没有炸开之时, 就把格子数进行减法,
// 当 减下来的数 等于 雷的总数时, 表示, 剩下的都是雷,
// 表示其余的地方都点击过, 表示, 找到了所有雷.
// 需要格子总数, 雷数, 可以在arr 数据结构中设置.


// 这些部分的展现形式, 还没有确定, 是依照原先的版本还是现在的版本.

// 另, 关于, 显示数字的方式, 我们增加一点3d翻转的感觉.