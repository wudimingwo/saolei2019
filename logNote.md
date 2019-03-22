## 1 
需要格子
      每个格子 -- >  dom 元素
      二维数组, 进行标记
      
      格子的状态
      -- 未被点击时, 灰色
      -- 被点击时, 空白格子, 数字格子, 地雷格子
      -- 可进行标记, 表示雷, 或者问号.
      
      初始化,
      确定, 雷的个数, --> (另外一些没用的想象, 可以搞一个六边形的扫雷, 也可以搞一个整体是六边形, 或者是圆形的扫雷, 可作为后序版本)
      随机, 分布雷的排版,
      根据,雷的位置, 计算其余位置的数字, 若是0 则表示空余, 若是其他数字, 则用数字表示.
      
      -- 此处有两种思路, 一种就是像上面说的, 在初始化时, 就把所有位置的属性都确定下来, 其余的交互就只剩下翻转的过程.
      -- 另一种思路是, 在点击的瞬间, 再对没有雷的地方进行计算.
      -- 我们采取第一种思路.
      
      交互行为,游戏过程部分,
      点击空白格子时, 需要将整片空白区域都翻转过来,
      触发条件应该是, 数字为0时, 就翻转其余,
      若是其他数字, 则翻转数字, 但不扩散.
      
      点击数字时, 只翻转数字,
      点击雷时, 被点击的雷需要重点展示,
      并且全部的雷区, 都要进行翻转.
      
      这也是游戏失败的情况.
      另一种结束游戏的方法是, 把所有除了雷区之外的其余格子全部翻转之时, 游戏成功.
      
## 2 预想的问题
   -- 交互和样式放在一起
      -- 数据处理放在另一边,
      
      --问题1, 如何随机分布雷?
      即, 如何在一个二维数组中, 随机标记的问题.
      方法1. i, j 分别是二维数组的变量, 随机选出 数字 i 和 数字 j, 
      通过组合i,j, 找到数据, 如果数据已经标记为 雷, 则找寻下一个, 如果不是雷, 则标记为雷.
      优点, 能够实现, 
      缺点, 当雷数足够多时, 越往后, 越重叠的概率升高, 即, 雷越多, 消耗的性能就越大.
      方法2. 不使用随机的方式, 用某种算法直接确定足够数的 i,j, 保证i,j 在不超出限定的范围时, 完成标记.
      优点, 能够实现, 并相对方法1 节省性能.
      缺点, 如果算法太简单, 则有可能会导致用户推导雷时, 看破该算法, 从而用另一种方式进行.
      解决方法, 要么用高超一点的算法, 要么,我们随机准备多种算法, (10种?),
      每次随机选出算法, 此时, 用户总结归纳算法时, 会增加困难.
      -- 我们暂时选择方法1, 之后尝试 方法2
      
      -- 问题2, 一个单位需要多少种属性?
      我们建立一个二维数组,
      每个item 是一个对象, 每个对象需要有不同的属性值.
      都需要哪些属性的问题.
      1.需要相应的dom
      2.相应的标记,
      3. 相应的数字.
      -- 理论上来讲, 2 和 3 是互斥的标记属性,
      -- 所以我们可以给雷,标记属性时, 用数字, 0 表示空余, 1-8 表示正常的数字, 9 表示雷即可.
      4. 也许需要将 三种状态的类名 也放进去? -- 实际上, 数字决定类名.
      
      -- 问题3, 如何进行扩散算法?
      即, 点击空白格子时, 需要对该格子的周边的8个格子进行相当于翻转操作.
      先触发翻转任务, 然后判断该格子是什么属性, 然后进行样式上的展示,
      -- 子问题, 这里有个经典问题, 即, 我是广度优先, 还是深度优先的问题.
      -- 广度优先时, 我对周边的格子进行分类, 先进先翻转,
      -- 深度优先时, 我对周边的格子也进行分类, 但后进先翻转,
      -- 此处我们可先考虑 广度优先? 之后也可以尝试 深度优先, 在性能上, 我也不知哪个更好.
      
      -- 所谓的扩散运算, 是, 假设当前格子的坐标为 i,j, 则 需要对 (i - 1, j - 1), (i - 1, j), (i - 1, j + 1) , (i, j - 1),(i, j + 1),(i + 1,j,i, j+ 1),(i + 1,j + 1)
      等八个坐标进行循环遍历的操作.
      从数学上来讲, 有没有更简洁一点的运算表达?
      理论上来讲
      第一种, 双重for循环, 然后排除其中一个即可, 
    
    
    -- 问题4, 如何重新开始?
    -- 方法1. 可以用页面刷新重新载入的方式进行.
    -- 方法2. 重新初始化函数即可?
    
    -- 问题5, 我希望, 行数, 列数, 以及雷数可以自定义, 可否?
    -- 我们先预留出接口,先用某个数字进行编写, 之后再说.
    
    -- 问题6, 我希望, 不只是在pc端展示, 也希望在移动端展示, 如何?
    -- 可以用响应式布局. 可以考虑, flex 布局? 或者百分比布局?
       后续补充的问题,
    -- 问题7, 如何计算数字?
    -- 同扩散相同, 遍历该格子周边的格子, 如果是雷, 计数器就加一.
    
    -------------------------
    
    -- 问题8, 移动端时, 需要把长宽方向改变, 如何做到?
    -- 需要用媒体查询, 通过媒体查询, 判断长宽比, 哪个高, 就把宽设置为哪个方向?
    -- 这是个问题
    -- 如果不用媒体查询, 我们可以用 document.documentElement.clientWidth document.documentElement.clientHeight 进行比较 
    
    -- 问题9, 为防止扩散运算时, 出现死循环, 需要对已经翻转过的格子进行标记.
    
    
    ##3
      实际遇到的消耗时间的问题
    -- 发现计算的数字不对. 逻辑上似乎没问题.找不到问题所在, 所以才会出现耗费时间的情况,
    -- 如何进行甄别问题出在哪里?
    -- 1. 算法本身的问题
    -- 2. 观察哪个数据有问题
    
    -- 实际观察 数字发现, i,j 坐标所代表的我认为的dom 和 实际的dom 似乎不一致.
    -- 该问题应该出自, 雷的布局, 或者是 i,j 坐标轴的理解有问题
    -- 实际通过坐标与dom 的对比发现, 确实是坐标有问题. 应该把 x, y的顺序更改. i 为y 轴, j 为 x轴
    
    
    问题2 : 发现类名切换不起作用, 用的类名是0-9的数字, 发现数字开头是无法作为类名的
    
    
    问题3 : 发现初始化之后, 即, 重新启动游戏之时, 扩散运算似乎失效了, 很奇怪.
    到了这个阶段之后, 由于变量增多, 环节增多, 修改bug的过程, 即寻找bug原因的过程, 变得更加耗费时间.
    另一方面表示, 我写得这段代码的结构不太好, 所以跟踪变量, 以及修改bug在后期会变得越来越困难.
    
    还有, 雷的点击也不会进行扩散.
    
    初步判断是, 扩散运算时, 绑定的dom, 似乎会寻找前一次的dom
    
    解决方式很暴力, 因为怀疑是之前的dom 没能删干净, 所以这回把ul换得干净点, 果然就没问题了.
    
    问题4 : 为了响应式布局.格子的大小很难弄 
    
    问题5 : 当我为了竖屏, 让body 用 rotate 旋转时, body的长宽是个问题.
    
    问题出在哪里?
    
    有点伤心, 写出来的东西, 在pc 端勉强能玩, 在移动端不只是不能玩, 而且布局完全有问题.
    所以不应该给什么转屏的切换按钮,
    而是直接判断 客户端类型, 如果是移动端, 直接横屏如果是, pc端直接怎么样, 
    应该用这个策略.
    显得更方便一点.
    移动端的时候, 让百分比占得更大一点.
    
    ##4
     -- 准备开始写代码
    
    
    
    设定数据, 根据数据, 建立二维数组, 以及生成相应数量的dom元素.
    -- 在此之前, 我们先生成dom元素, 把样式简单弄一下, 要考虑响应布局移动端
    
    生成二维数组, 生成二维dom元素之后,(此处忽然想起, 也许我们可以弄一个立体的扫雷?)
    启动生成雷的函数, 在二维数组中进行相应的标记.
    计算其余格子的数字.
    
    然后样式初始化.
    
    点击时, 
    先触发翻转任务,
    对格子的标记进行判断,
    获得相应的样式类名, 如果是 数字, 则应该把数据传给展示层.
    每个数字, 应该有不同的类名.
    
    如果是 空白格子, 则需要进行扩散运算.
    此处有个问题,
    是先进行样式展示, 还是先进行扩散运算?
    从节省渲染性能的角度来讲, 肯定是希望先完成扩散运算,之后一起进行类名添加, 进行转换, 相对来讲, 应该会节省性能吧.
    逻辑上来讲, 这两个的先后顺序, 互相之间似乎并不影响.
    
    需要安全措施, 即, 当样式还没有完全展示之时, 不得再次进行翻转, 即, 防止连续点击.
    另, 该措施也可用于, 游戏结束之时.
    
    ##4
        第一阶段的总结,
    1. 首先, 基本功能全都实现.
    2. 其次, 整个代码的结构很有问题,
       -由于,结构混乱, 所以后面寻找bug的难度越来越高, 可维护性, 可扩展性很差,
       - 应该考虑, 用面向对象的思维.
       - 面向对象的思维的最重要的部分, 就是理清关系, 把关系整理好, 
       - 哪个数据应该是谁的属性, 哪个方法, 应该是谁的行为,
       - 哪些概念应该成为一个"谁", 成为一个对象,  这些是面向对象重要的地方
       - 所以, 面向对象, 首先要有对象这个概念, 数据的概念, 行为的概念.
       - 这个过程中, 整个代码就自然而然的整理出来了.
       
       
       ##5
           今天的主要目标是, 修改扫雷的样式, 
    思路,
    让其有一个比较炫酷的效果, 有一个3d的效果,
    首先大背景应该是有点宇宙光一样的, 缓缓流动的效果. 
    -- 可以用 background , bc-position, 以及 rotate 来实现简单版本
    然后每个格子应该是3d的,点击的时候, 应该进行旋转, 
    -- 首先是, 让所有li的css样式变成立体的, 然后每一面设置不同的颜色,
    -- 需要增加四个dom嘛? 如果增加, 则实现起来没问题, 但性能上消耗应该很大. 这需要css 3d 要有景深什么的
    -- 如果不用dom, 如何实现? canvas ? 还是svg?
    -- 或者用伪元素? 一个dom 只有
    常态时,要有种漂浮的感觉. 
    -- 这个可以用css animation rotate
    点击一个时, 需要有引起波兰的感觉, 向外传递
    -- 监听事件, 这个应该是最难的, 留到后面再思考
    -- 第一种思路是, 用一个canvas 或者另一个dom元素, 点击的时候, 产生一个光圈向外扩展的动画
    -- 第二种思路是, 被点击之后,给每个临近的dom元素, 按照时间间隔,弄一个css的动画, 需要用扩散算法,
    -- 这样的效果应该就不是原型而是接近于方形. 这个扩散应该只扩散3到4层, 没必要扩散到整个区域.
    -- 波纹和波纹之间可以有两种模式, 一种是互不影响, 一种是后发生的覆盖前面发生的.
    大概能够做到这几个效果,
    应该是比较炫酷的.


##6 
加上所谓的3d效果的样式之后的目前阶段的总结.
1. 最大的问题是, 性能问题, 这个性能表现简直无法接受
简单级别的很勉强, 高级级别的, 实在是太卡了.
- 可能的原因
- 首先,整个代码结构还是有问题. 可视化, 语义化, 结构化都不好, 估计过两天, 我就看不懂自己写的了.
- 其次,对dom的计算量可能太大了.
- 3d动画效果的实现用了太多dom元素, 以及产生动画的单位有可能太多了, 单纯在渲染的性能上, 就出现了问题.
- 总之, 这个部分, 我们尽量试着优化一下.
2. 第二个问题是, 整个3d效果依然表现的很low, 没有达到我想要的某种科技感的展现.
- 这一部分, 可以慢慢修改.


- 试着进行优化性能.
- 现在假设一种情况, 即, 当同时渲染格子时, 格子的数量越多, 则渲染所需要消耗的性能就越大, 即, 越卡顿,
- 首先要印证这个假设,
----简单测试发现, 数量超过100个左右的时候, 很明显的不流畅.
- 其次,如果这个假设成立, 那么有一种思路是,目前观察可以看出, 扩散运算之后的格子, 没有像我们的预设一样,
- 一个一个进行翻转, 而是一起翻转的, 可能的原因是, 浏览器会把同一批的样式操作放在一起,
- 而这个特性导致, 我们想要的多米诺效果没出来, 而且还导致渲染上的卡顿.
----如何实现?
---- 第一种思路, 用监听的方式, 前一个动作完成之后, 才执行下一个,
---- 放到代码中就是, 在扩散运算时,添加样式的方式, 要更改一下.
---- 扩散算法要改一下?

---- 也就是说, 类名的切换 和 扩散运算要结合在一起, 并且由于渲染性能上的问题, 
---- 以及, 想要的渲染效果的问题, 我们需要有动画监听
---- 有了事件监听, 就不能简单的用数组遍历的方式.
---- 第一种思路, 可以用迭代器? 迭代器, 确实有暂停的功能.
---- 第二种思路, 用递归的方式, 进行?
---- 第三种思路, 用promise
---- 我们还是用原生, 初级思维,进行一下.

----- 另一个问题, 之前非3d时, 数据的展示全部都在son 一个dom元素上, 
---- 所以当时, 我们选择的在点击翻转的时候, 把tag放进去.
---- 现在的情况是, 可以提前进行运算, 把数据放在 back元素中, 这样应该能减少一些交互时的运算.
---- 按照这个逻辑, 右键时的 x 和 ? 也可以在交互事件之前, 就放在某个dom 元素中.比如, down, 和right,
---- 这样的话, 交互时, 就不存在 dom.innerText = item.tag 这个运算行为发生了.
---- 好处: 减少交互时的运算, 坏处 : 增加内存空间 
---- 侧面说明 : 可用空间换取时间.

---- 即使改了tag, 性能还是不行. 还是惨不忍睹
---- 还有什么东西是 在交互之前能先确定的?
---- 可以把a+ tag 的类名事先添加进去. 可以在getNumber 的时候, 完成
---- 
---- 通过这两种手段, click事件的交互反应确实好了特别多, 改成高级别, 还是很卡顿
---- 另一个问题是, 右键的交互非常的慢. 
---- 根据同样的思路, 我们想办法, 把运算的东西弄到交互外面.

---- 关于右键, 通过闭包的方式, 把几个变量弄了出去, 好了一点点, 还是很卡.
---- 试着把showBoom 给去掉了, 发现流畅性得到很大的提升. 很尴尬. 这应该是必要的功能之一. 有办法优化嘛?