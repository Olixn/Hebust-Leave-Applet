// pages/info/info.js
import request from '../../utils/request'
import config from '../../utils/config'

const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px'
let qrcodeWidth = rpx2px(350)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeArray: ['事假', '病假', '实习', '其他'],
        iconUrl: "",
        timeDif: 0,
        healthyArray: [
            '没有出现症状 ;',
            '感冒样症状：乏力、咳嗽、发烧、肌肉痛、头痛喘憋、呼吸急促 ;',
            '恶心呕吐、腹泻心慌、胸闷 ;',
            '结膜炎(红眼病样表现：眼睛涩、红、分泌物) ;',
            '其他症状'
        ],
        healthyList: [],
        qrcodeWidth: qrcodeWidth,
        isShowQR:false
    },

    // 展示大图
    showPic() {
        wx.previewImage({
            urls: [this.data.picUrl]
        })
    },

    // 自动音频
    autoAudio(audioPath) {
        if (audioPath == '') {
            return
        }
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = audioPath
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },

    // 删除申请
    deleteTask() {
        let taskid = this.data.taskid
        wx.showModal({
            title: '提示',
            content: '您确定要删除此申请吗？',
            success: res => {
                if (res.confirm) {
                    request('/tasks', {
                        taskid: taskid
                    }, 'DELETE').then((data) => {
                        wx.switchTab({
                            url: '/pages/recomd/recomd',
                        })
                    })
                } else if (res.cancel) {
                    // 取消点击
                }
            }
        })
    },

    // 修改信息
    editInfo(){
        console.log('修改');
    },

    // 展示二维码
    showQR(){
        new QRCode('canvas', {
            // usingIn: this,
            text: "kd-" + this.data.id,
            width: qrcodeWidth,
            height: qrcodeWidth,
            colorDark: "#333333",
            colorLight: "#FFFFFF",
            correctLevel: QRCode.CorrectLevel.H,
        });
        this.setData({
            isShowQR:true
        })
    },

    // 关闭二维码展示
    closeQR(){
        this.setData({
            isShowQR:false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let taskid = options.taskid
        // 获取用户id
        let openid = wx.getStorageSync('openid')
        if (!openid) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        } else {
            request('/tasksInfo/' + openid + '/' + taskid).then((data) => {
                data.userInfo.picUrl = config.host + data.userInfo.picUrl

                let arrayTmp = []
                Object.values(data.taskInfo.healthy).forEach((item) => {
                    arrayTmp.push(this.data.healthyArray[item]);
                })
                // ios与安卓new Date处理格式不同，在此统一为0000/0/0 00:00:00
                var timeOne = new Date((data.taskInfo.startTime).replace(/-/g,'/'))
                var timeTwo = new Date((data.taskInfo.endTime).replace(/-/g,'/'))
                var timeDif = timeTwo.getHours() - timeOne.getHours()
                if (data.taskInfo.status == 0) {
                    data.taskInfo.iconUrl = "/static/imgs/review.png"
                    data.taskInfo.audioPath = ""
                } else if (data.taskInfo.status == 1) {
                    data.taskInfo.iconUrl = "/static/imgs/by.png"
                    data.taskInfo.audioPath = "/static/mp3/pass-prompt.mp3"
                } else {
                    data.taskInfo.iconUrl = "/static/imgs/complete.png"
                    data.taskInfo.audioPath = ""
                }
                this.setData({
                    ...data.userInfo,
                    ...data.taskInfo,
                    timeDif,
                    healthyList: arrayTmp
                })
                this.autoAudio(data.taskInfo.audioPath)
            })
        }
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