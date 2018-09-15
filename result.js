// pages/result/result.js
const draw = require('../../utils/draw.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.addpic()
    // this.createImg()
  },
  /**
   * 生成图片(框架版)
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

    let result = draw.gk_draw(params,function(res){
      // 注，这里的res就是图片地址了
      that.setData({
        resultimg:res
      })
    })
  },

  /**
   * 生成图片
   */
  addpic:function(){
    let backgroundImg = '/images/result.jpg'
    let backgroundImg2 = '/images/result2.jpg'
    let showminicode = wx.getStorageSync('showminicode')
    let nickname = wx.getStorageSync('nickname')
    let imgurl = wx.getStorageSync('imgurl')
    let that = this

    let ctx = wx.createCanvasContext('share', this)

    // drawBackimg
    if (showminicode == '1') {
      ctx.drawImage(backgroundImg2, 0, 0, 750, 1334)
    }else{
      ctx.drawImage(backgroundImg, 0, 0, 750, 1334)
    }
    
    // draw poem and word(a pic)
    ctx.drawImage(imgurl,92,80,652,690)

    
    // draw nickname
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    ctx.setFontSize(50)
    ctx.setFillStyle('white')
    ctx.fillText(nickname,375,1209)
    // saveToAblum

    ctx.draw(true,function(){
      wx.canvasToTempFilePath({
        canvasId: 'share',
        x:0,
        y:0,
        width:750,
        height:1334,
        destWidth:750,
        destHeight:1334,
        fileType:'jpg',
        success: function (res) {
          that.setData({
            resultimg: res.tempFilePath
          })
          setTimeout(function(){
            wx.showToast({
              title: '预览模式下长按可保存哦~',
              icon: 'none',
              duration: 2300
            })
          },500)
          
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
  },

  /**
   * goPreview
   */
  goPreview:function(){
    let url = this.data.resultimg
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * backto
   */
  backto:function(){
    wx.navigateBack({
      delta:1
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})