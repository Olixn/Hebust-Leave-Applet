// pages/recomd/recomd.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeIndex: 5,
    typeArray: ['审核中', '审核通过', '审核驳回', '完成', '逾期'],
    type2Index: 2,
    type2Array: ['未销假', '已销假'],
    isHas: false,
    tasks: [],
    typeArray: ['事假', '病假', '实习', '其他'],
    statusText: '',
    color: ''
  },

  // pickerOne
  bindPickerOneChange: function (e) {
    console.log('pickerOne发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeIndex: e.detail.value
    })
  },

  // pickerTwo
  bindPickerTwoChange: function (e) {
    console.log('pickerOne发送选择改变，携带值为', e.detail.value)
    this.setData({
      type2Index: e.detail.value
    })
  },

  // 清空
  reset() {
    this.setData({
      type2Index: 2,
      typeIndex: 5
    })
  },

  // 去详情页
  goToInfo(e) {
    let taskid = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/info/info?taskid=' + taskid,
    })
  },

  // 去申请页
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 操作
  operate(e) {
    let index = e.currentTarget.id
    let task = this.data.tasks[index]
    if (task.status == 0) {
      wx.showModal({
        title: '提示',
        content: '您确定要删除此申请吗？',
        success: res => {
          if (res.confirm) {
            request('/tasks', {
              taskid: task.taskid
            }, 'DELETE').then((data) => {
              this.getUserTaskList()
            })
          } else if (res.cancel) {
            // 取消点击
          }
        }
      })
    }
  },

  // 获取用户申请列表信息
  getUserTaskList() {
    // 获取用户id
    let openid = wx.getStorageSync('openid')
    if (!openid) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    } else {
      // 拉取个人信息
      request('/tasksList/' + openid).then((data) => {
        data.isHas = data.isHas ? true : false
        data.tasks.forEach((item) => {
          if (item.status == 0) {
            item.statusText = '审核中'
            item.color = '#FED001'
            item.opText = '删除'
          } else if (item.status == 1) {
            item.statusText = '审核通过'
            item.color = '#00B26A'
            item.opText = '修改'
          } else {
            item.statusText = '已完成'
            item.color = '#999999'
          }
        })
        this.setData({
          ...data
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserTaskList()
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
    this.getUserTaskList()
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
    let openid = wx.getStorageSync('openid')
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    request('/tasksList/' + openid).then((data) => {
      data.isHas = data.isHas ? true : false
      data.tasks.forEach((item) => {
        if (item.status == 0) {
          item.statusText = '审核中'
          item.color = '#FED001'
          item.opText = '删除'
        } else if (item.status == 1) {
          item.statusText = '申请通过'
          item.color = '#00B26A'
          item.opText = '修改'
        } else {
          item.statusText = '已完成'
          item.color = '#999999'
        }
      })
      this.setData({
        ...data
      })
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    })
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