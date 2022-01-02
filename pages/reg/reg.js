// pages/reg/reg.js
import request from '../../utils/request'
import config from '../../utils/config'
import Notify from '../../miniprogram/miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram/miniprogram_npm/@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        userType: "1",
        stuName: '',
        stuNum: '',
        stuClass: '',
        stuUni: '',
        stuPro: '',
        fileList: [],
        picPath: '',
        isFirst: true,
        isOk: true
    },

    // 单选框
    radioChange(e) {
        const userType = e.detail
        this.setData({
            userType
        })
    },

    // 监听输入
    handleInput(event) {
        let type = event.currentTarget.id
        this.setData({
            [type]: event.detail.value
        })
    },

    // 头像上传
    afterRead(event) {
        const {
            file
        } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        Toast.loading({
            message: '上传中...',
            forbidClick: true,
        });
        wx.uploadFile({
            url: config.host + '/upload', // 仅为示例，非真实的接口地址
            filePath: file.url,
            name: 'file',
            formData: {
                openid: this.data.openid
            },
            success: (res) => {
                // 上传完成需要更新 fileList
                const fileList = this.data.fileList
                const picUrl = config.host + JSON.parse(res.data).picPath
                const picPath = JSON.parse(res.data).picPath
                fileList.push({
                    ...file,
                    url: picUrl
                });
                this.setData({
                    fileList,
                    picPath
                });
                Toast.clear()
            },
        });
    },

    // 头像删除
    deletePic(event) {
        const picPath = this.data.picPath;
        request('/upload/del', {
            picPath
        }, "DELETE").then((data) => {
            this.setData({
                fileList: [],
                picPath: ''
            })
        })

    },

    // easyCheck
    checkEmpty() {
        let data = this.data
        let arr = Object.values(data)
        let isEmpty = 0
        arr.forEach((item) => {
            if (item.length == 0) {
                isEmpty++
            }
        })
        return isEmpty
    },

    // 请空
    reset() {
        if (this.data.picPath) {
            this.deletePic()
        }
        this.setData({
            stuName: '',
            stuNum: '',
            stuClass: '',
            stuUni: '',
            stuPro: ''
        })
        return Notify({
            type: 'success',
            message: '已清空'
        });
    },

    // 注册
    reg() {
        let isEmpty = this.checkEmpty()
        if (isEmpty) {
            return Notify({
                type: 'warning',
                message: '您有未填的选项'
            });
        }
        request('/reg', {
            openid: this.data.openid,
            stuName: this.data.stuName,
            stuNum: this.data.stuNum,
            stuClass: this.data.stuClass,
            stuPro: this.data.stuPro,
            stuUni: this.data.stuUni,
            picUrl: this.data.picPath
        }, "post").then((data) => {
            // console.log(data);
        })
        this.setData({
            isFirst: false,
            isOk: true
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let openid = wx.getStorageSync('openid')
        if (!openid) {
            console.log("openid不存在，去授权");
            wx.redirectTo({
                url: '/pages/login/login',
            })
        } else {
            this.setData({
                openid
            })
        }
        // 获取用户审核进度信息
        request('/reg/status/' + openid).then((data) => {
            if (data.code == 1) {
                const isOk = data.info.isOk
                if (isOk == 0) {
                    this.setData({
                        openid,
                        isFirst: false
                    })
                } else if (isOk == 3) {
                    this.setData({
                        openid,
                        isOk: false
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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