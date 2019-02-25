背景：由于小程序没有直接分享到朋友圈的接口，但一些日常操作又需要用到分享到朋友圈等。于是，
只能采取“曲线救国”的路线，生成一张精美的卡片等，由用户分享朋友圈。

## 1.关于canvas的一些坑

+ 1.canvas组件在hidden情况下依然可以执行绘制操作，并且不占据空间。
+ 2.canvas组件在hidden情况下需要指定width和height，在hidden情况下，无法对canvas的width和height进行动态调整
+ 3.要想动态调整canvas的width和height，需要使用wx:if="{{}}"来配合。 // 缺点是，绘制的时候canvas是显示的
注：也就是使用控制条件，平时不显示，在需要绘制的时候才显示进行绘制图片(可以放到页面底部)

## 2.canvas的封装

canvas绘制分享图片的操作可能在一个项目中要用上好几次，或者很多项目都需要用到。这时候我们就可以把它封装
起来，到用的时候直接调用。也省的每次都编写重复的代码，还可能出错。

### 2.1 制定目标

我们对canvas相关操作进行封装，其实是为了生成精美的分享图片(其中可能涉及到文字和图片的绘制)。
所以，目标我们有了。基于这个目标，我们大概需要如下属性。

### 2.2 敲定参数

- 1.canvasId  // string类型
- 2.offsetx   // number类型。也就是wx.canvasToTempFile()中的x，这个x不一定是0，所以我们设为这个参数名。
- 3.offsety   // number类型。同上
- 4.width     // number类型。wx.canvasToTempFile()中的width
- 5.height    // number类型。wx.canvasToTempFile()中的height
- 6.destWidth   // number类型。wx.canvasToTempFile()中的destWidth
- 7.destHeight  //number类型。wx.canvasToTempFile()中的destHeight

因为要绘制图片或者文字。所以，除此之外，我们还需要，imgList和wordsList

- 8.imgList  // array类型
- 9.wordsList  // array类型

imgList中，每个数据都应是1个需绘制图片的所有信息，所以它应该是json数据格式的，即{}，wordsList同理
那么imgList就需要如下数据且都是必须传入的(如果传入图片的话)

- 8.imgList   // array类型
	+ 1.source   // 图片地址
	+ 2.x        // 绘制的起点位置的x轴
	+ 3.y		 // 绘制的起点位置的y轴
	+ 4.width 	 // 绘制的width
	+ 5.height   // 绘制的height

同理，wordsList就需要如下数据，
- 9.wordsList   // array类型
	+ 1.word    // 即需要绘制的问题
	+ 2.x		// 绘制的位置点x
	+ 3.y		// 绘制的位置点y
	+ 同时可能还需要设置其他信息，如下(非必须)
	+ 4.font 	// 要绘制的文字大小size,用于setFontSize()
	+ 5.textAlign 	// 文字的水平对齐方式，仅为 'left' 'center' 'right'
	+ 6.textBaseLine  // 文字的纵向对齐方式，仅为 'top' 'bottom' 'middle' 'normal'
	+ 7.textColor	 // 文字的颜色

由于wordsList中存在非必须传入的一些属性，当不传入时，那么就可能会出现一些问题。于是设定一些
可以复用的参数，接着前面的wordsList下来

- 9.wordsList   // array 类型
- 10.font    // 全局的font，不传入时，默认为35
- 11.textAlign  // 全局的textAlign ，不传入时，默认为center
- 12.textBaseLine  // 全局的textBaseLin，不传入时，默认为middle
- 13.textColor     // 全局的textColor，不传入时，默认为 black

至此，所需要的参数，基本敲定。但我们不可能在调用方法的时候传入十几个参数。所以，我们就把这些参数，
用{}包起来(也就是接收一个{}格式的参数)，调用的时候把所有数据用{}包起来传进来即可。

### 2.3函数封装

新建js文件，开始封装函数

```
// data为{}格式数据,dosomething为回调函数
function gk_draw(data,dosomething){
	
}

```

新建验证函数，总共有3个。
+ 1.分别是验证{}第一层的数据，包含canvasId,offsetx,offsety,width...等
+ 2.如果imgList存在，验证其必填的数据是否填完
+ 3.同理，验证wordsList中必须要填的数据

```
// 验证offsetx,offsety,width,height,destWidth,destHeightd等必填参数
function checkCanvasToTempFileData(data){
  if ((!data.hasOwnProperty('offsetx')) || (typeof data.offsetx != 'number')){
    return false
  }
  if ((!data.hasOwnProperty('offsety')) || (typeof data.offsety != 'number')) {
    return false
  }
  if ((!data.hasOwnProperty('width')) || (typeof data.width != 'number')) {
    return false
  }
  if ((!data.hasOwnProperty('height')) || (typeof data.height != 'number'))  {
    return false
  }
  if ((!data.hasOwnProperty('destWidth')) || (typeof data.destWidth != 'number'))  {
    return false
  }
  if ((!data.hasOwnProperty('destHeight')) || (typeof data.destHeight != 'number'))  {
    return false
  }
  return true
}

// 验证imgList中的source,x,y,width,height等必填参数
function checkImgsInfo(info){
  if ((!info.hasOwnProperty('source')) || (typeof info.source != 'string')){
    return false
  }
  if ((!info.hasOwnProperty('x')) || (typeof info.x != 'number')) {
    return false
  }
  if ((!info.hasOwnProperty('y')) || (typeof info.y != 'number')) {
    return false
  }
  if ((!info.hasOwnProperty('width')) || (typeof info.width != 'number')) {
    return false
  }
  if ((!info.hasOwnProperty('height')) || (typeof info.height != 'number')) {
    return false
  }

  return true
}

// 验证word,x,y等必填参数
function checkWordsInfo(info){
  if ((!info.hasOwnProperty('x')) || (typeof info.x != 'number')) {
    return false
  }
  if ((!info.hasOwnProperty('y')) || (typeof info.y != 'number')) {
    return false
  }
  if ((!info.hasOwnProperty('word')) || (typeof info.word != 'string')) {
    return false
  }

  return true
}

```

1.在gk_draw中加入data的验证代码，如下
```
	// 先显示加载框
  wx.showLoading({
    title: '加载中...',
  })

	// 数据验证
  if (!checkCanvasToTempFileData(data)){
    //报错
    console.error('fail to draw , wordsList and imgList can not empty both')
    // 终止执行
    return 'fail'
  }
  
  // 获取必须参数
  let mycanvasid = data.canvasId
  let offsetx = data.offsetx
  let offsety = data.offsety
  let width = data.width
  let height = data.height
  let destWidth = data.destWidth
  let destHeight = data.destHeight

```

2.验证imgList和wordsList,因为canvas画图分享必然会绘制这两者之一。
```
  // 此处如果需要指定图片格式可自行加入相关代码
  // 及生成图片质量等

  let wordsList = []
  let imgList = []

  if (data.hasOwnProperty('wordsList') && (typeof data.wordsList == 'object')){// 如果存在文字数组
    
    wordsList = data.wordsList
  }

  if (data.hasOwnProperty('imgList') && typeof data.imgList == 'object') {// 如果存在图片数组
    
    imgList = data.imgList
  }

  let wlen = wordsList.length
  let ilen = imgList.length

  // 两者不能同时为空，事实上，绝大多数绘图都会同时绘制这两样元素
  if((wlen == 0) && (ilen == 0)){
    console.error('fail to draw , wordsList(array) and imgList(array) can not be empty both')
    return 'fail'
  }

```

3.绘制图片

```
  // 创建ctx
  let ctx = wx.createCanvasContext(mycanvasid, this)

  // 这里要先绘制图片，因为先绘制文字的话，图片会把文字覆盖掉
  if (ilen > 0){
    for (let i = 0; i < ilen; i++) {
      let theImgInfo = imgList[i]
	  
	  //验证数据
      if (!checkImgsInfo(theImgInfo)){
        console.error('fail to draw , some pramas of imgList can not be empty')
        return 'fail'
      }

      // 开始绘制图片
      ctx.drawImage(theImgInfo.source, theImgInfo.x, theImgInfo.y, theImgInfo.width, theImgInfo.height)

    }
  }

```

4.绘制文字

```
	if (wlen > 0){
		
		// 初始化一些数据
		let color = 'black'
		if (data.hasOwnProperty('textColor') && (typeof data.textColor == 'string')) {
		  color = data.textColor
		}
    
		let font = 35
		if (data.hasOwnProperty('font') && (typeof data.font == 'number')) {
		  font = data.font
		}
		let textAlign = 'center'
		if (data.hasOwnProperty('textAlign') && (typeof data.textAlign == 'string')) {
		  textAlign = data.textAlign
		}

		let textBaseLine = 'middle'
		if (data.hasOwnProperty('textAlign') && (typeof data.textBaseLine == 'string')) {
		  textBaseLine = data.textBaseLine
		}
		
		
		for(let i=0;i<wlen;i++){
		  let wordInfo = wordsList[i]

			// 验证数据
			if (!checkWordsInfo(wordInfo)){
				console.error('fail to draw , some pramas of wordsList can not be empty')
				return 'fail'
			 }
			  
			// 设置具体渲染信息
			let mycolor = color
			if (wordInfo.hasOwnProperty('textColor') && (typeof wordInfo.textColor == 'string')) {
				mycolor = wordInfo.textColor
			 }
			let myfont = font
			if (wordInfo.hasOwnProperty('font') && (typeof wordInfo.font == 'number')) {
				myfont = wordInfo.font
			}
			let myTextAlign = textAlign
			if (wordInfo.hasOwnProperty('textAlign') && (typeof wordInfo.textAlign == 'string')) {
				myTextAlign = wordInfo.textAlign
			}
			let myTextBaseLine = textBaseLine
			if (wordInfo.hasOwnProperty('textAlign') && (typeof wordInfo.textBaseLine == 'string')) {
				myTextBaseLine = wordInfo.textBaseLine
			}
			  
			ctx.setFillStyle(mycolor)
			ctx.setFontSize(myfont)
			ctx.setTextAlign(myTextAlign)
			ctx.setTextBaseline(myTextBaseLine)

			// 开始绘制文字
			ctx.fillText(wordInfo.word, wordInfo.x, wordInfo.y)
		}
	}

```

4.生成图片

```
// 生成图片
  ctx.draw(true,function(){
    wx.canvasToTempFilePath({
      canvasId: mycanvasid,
      x:offsetx,
      y:offsety,
      width:width,
      height:height,
      destWidth:destWidth,
      destHeight:destHeight,
      success:function(res){
		  
		// 绘制成功后，返回该图片的地址，并执行回调函数
        dosomething(res.tempFilePath)
      },
      fail: function () {
        // 导出图片错误
        wx.showModal({
          title: '导出图片时出错',
          content: '请重新尝试！',
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    }, this)
  })

```

5.暴露接口	
```
module.exports = {
  gk_draw: gk_draw
}
```


6.使用

在要用的地方引入，如

```
// pages/result/result.js
const draw = require('../../utils/draw.js')
```

// 在需要的地方绘制

```
 /**
   * 生成图片(接口版)
   */
  createImg:function(){

    let that = this
    let backgroundImg = '/images/result.jpg'
    let nickname = wx.getStorageSync('nickname')
    let imgurl = wx.getStorageSync('imgurl')

    let params = {
      canvasId:'share',
      textColor:'white',
      offsetx:0,
      offsety:0,
      width:750,
      height:1334,
      destWidth:750,
      destHeight:1334,
      imgList:[
        {
          source: backgroundImg,
          x:0,
          y:0,
          width:750,
          height:1334
        },
        {
          source: imgurl,
          x: 92,
          y: 80,
          width: 652,
          height: 690
        },
      ],
      wordsList:[
        {
          word:nickname,
          font:50,
          x: 375,
          y:1209
        }
      ]
    }

    draw.gk_draw(params,function(res){
      // 注，这里的res就是图片地址了
      that.setData({
        resultimg:res
      })
    })
  }
  
  ```
  
完整版代码如下：

[传送门至draw.js](https://github.com/middleHallo/miniProgramNote/blob/master/draw.js)