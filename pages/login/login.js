// pages/login/login.js
import request from '../../utils/request'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    // 获取code
    getUserInfo(){
        // console.log("getuserinfo");
        wx.login({
          timeout: 3000,
          success:(res)=>{
            wx.showLoading({
                title: '授权中...',
            })
            this.getOpenId(res.code)
          }
        })
    },

    // 获取用户标识openid
    getOpenId(code){
        request('/login/' + code).then((data)=>{
            wx.setStorageSync('openid', data.openid)
            this.getUserReg(data.openid)
        })
    },

    // 获取用户注册信息
    getUserReg(openid){
        request('/user/' + openid).then((data)=>{
            if (!data.isReg || !data.isOk ) {
                wx.hideLoading({
                    success: (res) => {
                        wx.reLaunch({
                          url: '/pages/reg/reg',
                        })
                    },
                })
            } else {
                wx.hideLoading({
                    success: (res) => {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                    },
                })
            }  
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let openid = app.globalData.openid
        console.log(openid);
        if (openid) {
            this.getUserReg(openid)
        } else {
            this.getUserInfo()
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