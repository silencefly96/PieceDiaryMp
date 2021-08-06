// pages/index/detail/detail.js
const DEFAULT_SIZE = 32
const COLOR_ARRAY = ['#616161', '#1FD55C', '#0B7BFB', '#FE4C4C', '#FF9000']

const fs = wx.getFileSystemManager()
const app = getApp()


Page({

	data: {
		//底部高度
		bottomHeight: app.globalData.bottomHeight,
		//容器高度 = 屏幕高度 - 顶部高度 - 底部高度 - 底部按钮栏高度 - 顶部按钮高度 - (20 + 10)rpx 的 margin 值
		containerHeight: app.globalData.screenHeight - app.globalData.topHeight - app.globalData.bottomHeight - 96 - 60 - 30,

		//保存路径
		path: '',
		//标题
		title: '',
		//分年月目录的路径
		dirPath: '',
		//内容
		content: '',

		//字体大小
		fontSize: DEFAULT_SIZE,
		//字体颜色数组
		fontColorArray: COLOR_ARRAY,
		//字体颜色index
		fontColorIndex: 0,
	},

	onLoad: function (options) {
		let that = this
		let path = options.path
		let title = options.title
		let dirPath = `${wx.env.USER_DATA_PATH}/` + path.substring(0, 4) + '/' + path.substring(5)
		this.setData({
			path: path,
			title: title,
			dirPath: dirPath
		})

		//读取已存在内容
		fs.readFile({
			filePath: dirPath + '/' + title + '.txt',
			encoding: 'utf8',
			position: 0,
			success(res) {
				that.setData({
					content: res.data
				})
			},
			fail(res) {
				//文件存在，但出了错误
				if (res.errMsg.substring('no such file') < 0) {
					app.showErrorToast('读取文件失败:' + res.errMsg)
				}
			}
		})
	},

	//双向绑定不太好用
	inputText(e) {
		let content = e.detail.value
		this.setData({
			content: content
		})
	},

	//按下enter键时，下一段自动缩进两字符
	nextParagraph(e) {
		app.log('nextParagraph')
		let content = e.detail.value + '\t\t\t\t'
		this.setData({
			content: content
		})
	},

	//点击完成，写数据到文件
	onFinish() {
		let that = this

		//检查目录是否存在
		fs.access({
			path: this.data.dirPath,
			success(res) {
				that.writeFile()
			},
			fail(res) {
				//文件夹不存在
				if (res.errMsg.substring('no such file') >= 0) {
					//递归创建文件夹
					fs.mkdir({
						dirPath: this.data.dirPath,
						recursive: true,
						success(res) {
							that.writeFile()
						},
						fail(res) {
							app.showErrorToast('创建文件夹失败:' + res.errMsg)
						}
					})
				}else {
					app.showErrorToast('读取文件失败:' + res.errMsg)
				}
			}
		})
	},

	writeFile() {
		let that = this
		fs.writeFile({
			filePath: this.data.dirPath + '/' + this.data.title + '.txt',
			data: this.data.content,
			encoding: 'utf8',
			success(res) {
				app.showSuccessToast('保存成功！')
				that.setPrePageChange()
				wx.navigateBack()
			},
			fail(res) {
				app.showErrorToast('保存失败:' + res.errMsg)
			}
		})
	},

	//修改上一页数据
	setPrePageChange() {
		var pages = getCurrentPages();
		var prevPage = pages[pages.length - 2]; //上一页

		//刷新数据
		prevPage.loadDiaryList(this.data.path)
	},

	//修改字体大小
	changeFontSize(e) {
		let value = parseInt(e.currentTarget.dataset.value) 
		let fontSize = this.data.fontSize
		if((value > 0 && fontSize < 44) || (value < 0 && fontSize > 20)) {
			this.setData({
				fontSize: fontSize + value 
			})
		}else if(value == 0) {
			this.setData({
				fontSize: DEFAULT_SIZE
			})
		}else {
			app.showErrorToast('请保持合适大小！')
		}
	},

	//修改字体颜色
	changeFontColor() {
		this.setData({
			fontColorIndex: ++this.data.fontColorIndex % 5
		})
	},


})