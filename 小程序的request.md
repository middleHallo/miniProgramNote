---


---

<h3 id="关于小程序的请求函数-wx.request">关于小程序的请求函数 wx.request</h3>
<p>小程序的请求方法，wx.request()的一些注意事项</p>
<p>wx.request()支持get和post请求，通过异步的方式进行回调。主要有3个回调方法</p>
<p>1.success()，请求成功的回调方法。这里的请求成功指的是，从发出请求到服务器完成响应并返回相关数据为止！也就是说，只要服务器响应了，那么就算请求完成，包括404 not found ,500 服务器内部错误等响应，所以需要开发者自己进行判断。</p>
<p>2.fail()，请求失败的回调方法。这里的请求失败指的是，除了success()情况下的其他情况。</p>
<p>3.complete()，无论请求成功还是失败，都会调用此回调函数。</p>
<h3 id="小程序的wx.request的封装">小程序的wx.request()的封装</h3>
<pre><code>// 使用方法
// 在js中引入相关文件传入完整的url(参数拼接在这里)，
const util = require('你的小程序文件相对路径')
// 调用
util.gk_get(yoururl,function(res){
	// 这里判断后台自定义的可能出现的各种情况，例如参数错误什么的。
	// and do something
})

/******封装方法*******/
// 请求数据,需传入完整的url
function gk_get(url, dosomething) {
	wx.showLoading({
		title: '加载中...',
	})
	wx.request({
		url: url,
		data: [],
		success: function (res) {
			if(res.statusCode != 200){
				return gk_requestStatus(res.statusCode)
			}
			dosomething(res)
		},
		fail: function (err) {
			console.log('errorRequestType=get')
			console.log(err)
			// 这里可以进行错误记录等。
			if (gk_is2g()) {
				gk_showToastNoIcon('当前网络状态差，请换个网络重试')
			} else {
				gk_showToastNoIcon('服务器长时间无反应，请稍后重试！')
			}
			return  0
		},
		complete: function () {
			wx.hideLoading()
		}
	})
}

// 检测当前是否是2g网络
function gk_is2g() {
	wx.getNetworkType({
		success: function (res) {
			var networkType = res.networkType
			if (networkType == '2g') {
				return  true
			} else {
				return  false
			}
		},
		fail: function () {
			return  false
		}
	})
}
  
/**
* 统一处理一些请求错误（根据statusCode 来判断，而非后台返回的自定义code）
* 目前的statusCode 有
* 404() 500()
*/
function gk_requestStatus(statusCode) {
	let duration = 2000
	let title = ''
	switch (statusCode) {
	case  404:
		title = '404 not found,请联系管理员！'
	break;
	case  500:
		title = '500 服务器内部错误,请稍后重试！'
	break;
	default:
		// 当做未知错误处理
		title = '未知错误,请稍后重试！'
	break;
	}
	gk_showToastNoIcon(title)
	return  0
}

function gk_showToastNoIcon(str) {
	wx.showToast({
		title: str,
		icon: 'none',
		duration: 1500
	})
}
</code></pre>
<h4 id="post的封装也是依照这样">post的封装也是依照这样</h4>
<p>这里不再贴详细代码</p>

