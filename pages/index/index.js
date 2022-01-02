// index.js
import config from '../../utils/config';
import request from '../../utils/request'
import Notify from '../../miniprogram/miniprogram_npm/@vant/weapp/notify/notify';
Page({
  data: {
    stuNum:'',
    stuName:'',
    picUrl:'',
    stuUni:'',
    stuPro:'',
    stuClass:'',
    stuPhoneOne:'',
    stuPhoneTwo:'',
    status:'',
    reason:'',
    array:['事假','病假','实习','其他'],
    index: 4,
    checkbox:[],
    region:[],
    regionDetail:'',
    isCheck:false,
    isPickerRender: false,
    isPickerShow: false,
    timeType:"",
    startTime: "",
    endTime: "",
    pickerConfig: {
      endDate: false,
      column: "second",
      dateLimit: true,
      initStartTime: "",
      initEndTime: "",
      limitStartTime: "2015-05-06 12:32:44",
      limitEndTime: "2055-05-06 12:32:44"
    }
  },

  // 省市县
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 健康情况
  checkChange(event) {
    let checkbox = event.detail;
    if (checkbox.indexOf('0') != -1) {
      this.setData({
        isCheck:true,
        checkbox:['0']
      })
    } else {
      this.setData({
        checkbox: event.detail,
        isCheck:false
      });
    }
    
  },

  // 请假类型
  bindTypeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  // 监听输入
  handleInput(event) {
    // console.log(event);
    let type = event.currentTarget.id
    this.setData({
        [type]: event.detail
    })
  },

  // 监听文本框
  handleText(event) {
    // console.log(event);
    let type = event.currentTarget.id
    this.setData({
        [type]: event.detail.value
    })
  },

  // easyCheck
  checkEmpty(){
    let data = this.data
    let arr = Object.values(data)
    let isEmpty = 0
    arr.forEach((item)=>{
      if(item.length == 0) {
        isEmpty ++
      }
    })
    return isEmpty
  },

  // 提交
  submit(){
    let isEmpty = this.checkEmpty()
    if (isEmpty) {
      return Notify({ type: 'warning', message: '您有未填的选项' });
    }
    if (this.data.phoneOne == this.data.phoneTwo) {
      return Notify({ type: 'warning', message: '紧急联系电话不能与本人联系方式相同' });
    }
    let status = this.data.status
    if (status == 0) {
      return Notify({ type: 'warning', message: '您有未审核的请假申请' });
    }
    let openid = wx.getStorageSync('openid')
    let dataForm = {
      openid:openid,
      stuName: this.data.stuName,
      type: this.data.index,
      healthy: this.data.checkbox,
      reason: this.data.reason,
      region: this.data.region,
      regionDetail: this.data.regionDetail,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      phoneOne: this.data.stuPhoneOne,
      phoneTwo: this.data.stuPhoneTwo
    }

    request('/tasks',dataForm,'POST').then((data)=>{
      this.setData({
        status:0
      })
      Notify({ type: 'success', message: data.msg });
      wx.switchTab({
        url: '/pages/recomd/recomd',
      })
    })

  },

  onLoad() {
    // 获取用户id
    let openid = wx.getStorageSync('openid')
    if(!openid){
      wx.reLaunch({
        url: '/pages/login/login',
      })
    } else {
      // 拉取个人信息
      request('/userInfo/' + openid).then((data)=>{
        data.picUrl = config.host + data.picUrl
        this.setData({
          ...data
        })
      })
    }
  },

  // 多级时间选择器
  pickerShow: function(e) {
    let timeType = e.currentTarget.id
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true,
      timeType
    });
  },
  pickerHide: function() {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function(e) {
    // console.log("picker发送选择改变，携带值为", e.detail.value);
    // console.log(this.data.sensorList);

    this.getData(this.data.sensorList[e.detail.value].id);
    // let startDate = util.formatTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
    // let endDate = util.formatTime(new Date());
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
      // startDate,
      // endDate
    });
  },
  setPickerTime: function(val) {
    // console.log(val);
    let data = val.detail;
    let type = this.data.timeType
    if (type == "startTime") {
      this.setData({
        startTime: data.startTime,
      })
    } else {
      this.setData({
        endTime: data.startTime
      })
    }
  }

})
