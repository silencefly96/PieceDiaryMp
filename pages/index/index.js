// index.js
const util = require('../../utils/util.js');
const fs = wx.getFileSystemManager()
const app = getApp()

Page({

    data: {
        //当前日记目录
        currentPath: '2021-08',
        //分年月目录的路径
        dirPath: '',
        //新增日记名称
        newDiaryName: '',
        //日记列表
        diaryList: [],

        //显示月份选择框
        showPop: false,
        minDate: new Date(1997, 12, 28).getTime(),
        maxDate: new Date().getTime(),
        currentDate: new Date().getTime(),

        //显示新建日记对话框
        showDialog: false,
    },

    onLoad: function (options) {
        //加载当前月份的日记
        let currentPath = util.formatDate(new Date().getTime()).substring(0, 7)
        this.loadDiaryList(currentPath)
    },

    //下拉刷新
    onPullDownRefresh() {
        this.loadDiaryList(this.data.path)
    },

    //加载日记数据
    loadDiaryList(path) {
        let that = this
        let dirPath = `${wx.env.USER_DATA_PATH}/` + path.substring(0, 4) + '/' + path.substring(5)

        //更新标题
        this.setData({
            currentPath: path,
            dirPath: dirPath,
        })

        //异步读取文件列表
        fs.readdir({
            dirPath: dirPath,
            success(res) {
                let diaryList = []
                res.files.forEach(element => {
                    diaryList.push(element.substring(0, element.indexOf('.txt')))
                });

                that.setData({
                    diaryList: diaryList
                })
            },
            fail(res) {
                //读取文件列表失败，无文件目录属于正常
                if(res.errMsg.substring('no such file or directory') < 0) {
                    app.showErrorToast('读取文件失败:' + res.errMsg)
                }
            }
        })
    },

    //上一月
    lastMonth() {
        let currentPath = this.data.currentPath
        let date = new Date(currentPath);
        //经检测，直接加减没问题！
        date = date.setMonth(date.getMonth() - 1);
        date = new Date(date);

        let lastPath = util.formatDate(date.getTime()).substring(0, 7)
        this.loadDiaryList(lastPath)
    },

    //弹出月份选择框
    showDatePicker() {
        this.setData({
            showPop: true
        })
    },

    //关闭月份选择框
    hideDatePicker() {
        this.setData({
            showPop: false
        })
    },

    //选择月份
    selectMonth(e) {
        let currentPath = util.formatDate(new Date(e.detail).getTime()).substring(0, 7)
        this.hideDatePicker()
        this.loadDiaryList(currentPath)
    },

    //下一月
    nextMonth() {
        let currentPath = this.data.currentPath
        let date = new Date(currentPath);
        date = date.setMonth(date.getMonth() + 1);
        date = new Date(date);

        let lastPath = util.formatDate(date.getTime()).substring(0, 7)
        this.loadDiaryList(lastPath)
    },

    //查看日记
    viewDiary(e) {
        let index = e.currentTarget.dataset.index
        let title = this.data.diaryList[index]
        wx.navigateTo({
            url: './detail/detail?path=' + this.data.currentPath + '&title=' + title,
        })
    },

    //长按删除日记
    deleteDiary() {
        let that = this
        let index = e.currentTarget.dataset.index
        let title = this.data.diaryList[index]

        wx.showModal({
            title: '删除日记',
            content: '是否删除日记：' + title + "?",
            success(res) {
                if (res.confirm) {
                    that.deleteDiaryFile(index)
                } else if (res.cancel) {}
            }
        })
    },

    //删除日记文件
    deleteDiaryFile(index) {
        let diaryList = this.data.diaryList
        let dirPath = this.data.dirPath
        let title = diaryList[index]

        fs.unlink({
            filePath: dirPath + '/' + title + '.txt',
            success(res) {
                //更新显示
                diaryList.splice(index, 1)
                that.setData({
                    diaryList: diaryList
                })

                //如果该目录无日记，将目录也删除
                if(diaryList.length == 0) {
                    fs.rmdirSync(dirPath, true)
                }

                app.showSuccessToast('删除成功！')
            },
            fail(res) {
                app.showErrorToast('删除文件失败:' + res.errMsg)
            }
        })
    },

    //开启关闭对话框
    showDialog() {
        this.setData({
            newDiaryName: util.formatDate(new Date().getTime()),
            showDialog: !this.data.showDialog
        })
    },

    //新增日记
    addDiary() {
        let newDiaryName = this.data.newDiaryName
        wx.navigateTo({
            url: './detail/detail?path=' + this.data.currentPath + '&title=' + newDiaryName,
        })
    },

})