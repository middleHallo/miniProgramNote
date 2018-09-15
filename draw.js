
// data为一个{}，
// 数据结构为
// data:{
//    canvasId:'xxx',//require
//    textColor:'', // 文字的color，不填默认为黑色
//    font:35, //不填则默认为35px
//    textAlign:'', //值为'left'、'center'、'right',不填默认为center
//    textBaseLine:'',//值为 'top'、'bottom'、'middle'、'normal',不填默认为middle
//    offsetx:x,   //require wx.canvasToTempFile()中的x
//    offsety:y,  //require wx.canvasToTempFile()中的y
//    width:width, //require wx.canvasToTempFile()中的width
//    height:height, //require wx.canvasToTempFile()中的height
//    destWidth:destWidth, //require wx.canvasToTempFile()中的destWidth
//    destHeight:destHeight, //require wx.canvasToTempFile()中的destHeight
//    imgList里的图片一定要按顺序来，否则图片覆盖将会导致
//    imgList:[{
//        source:'xxx', // require
//        x:x,  // require
//        y:y,  // require
//        width:width,  // require
//        height:height,  // require
//    },
//    {
//        source:'xxx', // require
//        x:x,  // require
//        y:y,  // require  
//        width:width,  // require
//        height:height,   // require
//    }]
//    wordsList:[{
//        word:'xxx', // require
//        textAlign:'xxx', // 不填则取全局的textAlign
//        textBaseLine:'xxx', // 不填则取全局的textBaseLine
//        font:10,  // 不填默认取全局的font
//        textColor:'', //不填默认取全局的textColor
//        x:100,  // require
//        y:100,  //require
//    },
//    {
//        word:'xxx', // require
//        textAlign:'xxx',// 不填则取全局的textAlign
//        textBaseLine:'xxx',// 不填则取全局的textBaseLine
//        font: 10,// 不填默认取全局的font
//        textColor:'', //不填默认取全局的textColor
//        x:100, // require
//        y:100, //require
//        
//    }]
//  }

function gk_draw(data, dosomething){
  wx.showLoading({
    title: '加载中...',
  })

  if (!checkCanvasToTempFileData(data)){
    //报错
    console.error('fail to draw , wordsList and imgList can not empty both')
    // 终止执行
    return 'fail'
  }
  let mycanvasid = data.canvasId
  
  // canvasToTempFile()所需参数
  let offsetx = data.offsetx
  let offsety = data.offsety
  let width = data.width
  let height = data.height
  let destWidth = data.destWidth
  let destHeight = data.destHeight

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

  if((wlen == 0) && (ilen == 0)){
    console.error('fail to draw , wordsList(array) and imgList(array) can not be empty both')
    return 'fail'
  }
  
  // 创建ctx
  let ctx = wx.createCanvasContext(mycanvasid, this)

  // 这里要先绘制图片，因为先绘制文字的话，图片会把文字覆盖掉
  if (ilen > 0){
    for (let i = 0; i < ilen; i++) {
      let theImgInfo = imgList[i]
      if (!checkImgsInfo(theImgInfo)){
        console.error('fail to draw , some pramas of imgList can not be empty')
        return 'fail'
      }

      // 开始绘制图片
      ctx.drawImage(theImgInfo.source, theImgInfo.x, theImgInfo.y, theImgInfo.width, theImgInfo.height)

    }
  }

  if (wlen > 0){
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

      if (!checkWordsInfo(wordInfo)){
        console.error('fail to draw , some pramas of wordsList can not be empty')
        return 'fail'
      }
      // 渲染具体信息
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
}

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

module.exports = {
  gk_draw: gk_draw
}

