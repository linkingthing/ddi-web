# 地址规划前端代码难点说明

一整个页面由左边展示树和右边操作面板构成

- CoreTree
- panel

## CoreTree

- 该插件基于[d3js](https://github.com/d3/d3/blob/master/API.md)进行的封装 

#### 组件参数说明

> props

|属性|说明|类型|默认|
|-|-|-|-|-|
|data|树型数据，```{name:'root',id:1,children: []}```|Object|{}|
|options|设置位置信息，节点样式信息|Object||
|options.margin.left|设置位置信息，左外边距|Number|100|
|options.margin.top|设置位置信息，上外边距|Number|100|
|options.margin.right|设置位置信息，右外边距|Number|50|
|options.margin.buttom|设置位置信息，下外边距|Number|50|
|options.commonNodeBackgroundColor|普通节点背景色|String|```#f5f5f5```|
|options.healthNodeBackgroundColor|剩余量节点背景色|String|```#008000```|

> event

|事件名	|说明|返回值|
|-|:-|:-|-|-|
|onClickNode|点击事件，点击节点后聚焦节点样式，并且抛出当前节点数据，选择器|node, selection|

#### 核心思路

1. 初始构建，drawNode 函数定义树的<a href="#nodeStruct">节点结构</a>，后续的节点信息展示变更可以在这个函数下进行
2. 事件绑定 ，通常对树操作都是在节点上进行，所以 在drawNode函数中生成node 的过程中，对node绑定click事件，并且将当前的选择器以及节点携带的自生数据（完整数据通过parent，children属性获取），mouseover，mouseout暂未抛出事件，但实现方式一样
3. 视图更新，我目前在d3中没找到可以直接更新的api，所以采用先清空原有视图然后重新渲染的方式解决；watch 监听 data 参数变化 然后调用 idiotUpdate 方法，为了减少数据更新造成更新过于频繁 采用 600ms 防抖
4. 定位显示，由于每次数据变更都会促发重新渲染，所以需要每次更新后都聚焦上次编辑的节点停留在可视区域醒目位置，我采用 定义 currentNodeRecord 全局变量方式记录；如果后续有多个图，这种方式可能会冲突，可以采用map{page-function: currentNodeRecord}方式区分处理
5. 工具箱（暂时无此需求），在页面上点击双击或者右击后弹出工具箱，该工具箱在鼠标操作的位置显示，该功能暂未启用。demo可查看 showPop 相关代码
6. 点击圆点展开合拢子树（暂时无此需求）




<h4 id="nodeStruct">节点结构</h4>

|字段|意义|描述|
|-|-|:-|
|type|节点类型|该字段是前端获取到数据或者生成数据时增加。目前有 <br/><font color="#f80">originalNode</font>表示从后端请求的原始节点 <br/><font color="#f80">surplusNode</font>表示剩余资源展示节点，由前端计算生成，只展示没有操作<br/><font color="#f80">addNode</font>表示新增但是暂未提交的节点，由前端计算生成，需保存后才生效 |
|name|节点名称|||
|subnet|子网掩码 |例如：1111:1:4000::/35 ip+prefix|
|nodecode|起始编码||
|subtreebitnum|子树的位宽||
|siblingsTotalBitNumber|当前层级的位宽，本质是父节点的subtreebitnum属性 |surplusNode剩余资源计算依赖于父节点的subtreebitnum|
|depth|树深度|0为根节点|
|usedfor|用途描述||

## Tree

#### 主页面交互

1. 获取后端TreeData，计算增加剩余资源节点
    - treeDataAddOther
2. 选择树节点
    - 赋值当前节点给 currentNode对象，关联右侧panel面板
    - 展示地址卡尺
        - value
            - start 父节点的 subnet 的 prefixLen
            - end 当前节点的 subnet 的 prefixLen
        - bitFill
            - 根节点请求数段api
            - 非根节点采用当前节点nodecode计算 转2进制高位补零