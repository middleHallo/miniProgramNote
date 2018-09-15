背景：由于小程序没有直接分享到朋友圈的接口，但一些日常操作又需要用到分享到朋友圈等。于是，
只能采取“曲线救国”的路线，生成一张精美的卡片等，让用户分享朋友圈。

## 1.关于canvas的一些坑

+ 1.canvas组件在hidden情况下依然可以执行绘制操作，并且不占据空间。
+ 2.canvas组件在hidden情况下需要指定width和height，在hidden情况下，无法对canvas的width和height进行动态调整
+ 3.要想动态调整canvas的width和height，需要使用wx:if="{{}}"来配合。
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

至此，所需要的参数，基本敲定。但我们不可能在调用方法的时候传入几十个参数。所以，我们就把这些参数，
用{}包起来(也就是接收一个{}格式的参数)，调用的时候把所有数据用{}包起来传进来即可。
