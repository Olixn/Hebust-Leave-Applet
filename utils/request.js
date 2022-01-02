/* request.js
* Time：2021年10月5日16:59:41
* Author：Ne-21
* Desc：封装功能函数，发送Ajax请求
*/ 
import config from "./config"
export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            data,
            method,
            header: {
            },
            success: (res) => {
                console.log("请求成功", res);
                resolve(res.data)
            },
            fail: (err) => {
                console.log("请求失败", err);
                reject(err)
            }
        })
    })
}