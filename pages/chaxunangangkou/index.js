import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();

Page({
    onChange(e) {
        console.log('onChange', e)
        this.setData({
            value: e.detail.value,
        });
    },
    onConfirm(e) {
        console.log('onConfirm', e);
        wx.navigateTo({
            url: `/pages/chaxunangangkou/anguanjianzi?keyword=${e.detail.value}`
        });
    },
    onClear(e) {
        console.log('onClear', e)
        this.setData({
            value: "",
        });
    },
    onShow() {
        this.checkNewMoments();
    },
    data: {
        array: [],
        value: ""
    },
// //页面加载时
//   onLoad: function (){
//     var that = this;
//   console.log('denglu');
//     //检测是否登陆  姜洁
//     wx.getSetting({

//       success(res) {
//         console.log(res);
//         console.log('华泰别');
//         console.log(res.code+"[[[[");
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称
//           wx.getUserInfo({
//             success: function (res) {
//               console.log(res)
//               // console.log(res.userInfo)
//               that.setData({
//                 nickName: res.userInfo.nickName, //昵称
//                 avatarUrl: res.userInfo.avatarUrl //头像
//               })
//             }

//           })
//         } else {
//           console.log('未登陆');
//           setTimeout(function () {
//             wx.reLaunch({
//               url: '../login/index',
//             })
//           }, 1000)

//         }
//       }
//       })
//   },

    onReady() {
        this.getPortList();
    },

    async getPortList() {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}user/getPortList`)
                .query({
                    lastCheckMomentsTime: "2000-01-01 00:00:00"
                }).end();
            console.log("getPortList", res);
            if (res.statusCode === 200 && res.data.list) {
                page.setData({
                    array: res.data.list
                });
            } else {
                $wuxToast().show({
                    type: 'forbidden',
                    duration: 2000,
                    color: '#fff',
                    text: "调用接口时出现错误！"
                });
            }
        } catch (err) {
            console.log(err);
            $wuxToast().show({
                type: 'forbidden',
                duration: 2000,
                color: '#fff',
                text: err.toString()
            });
        }

    },

    async checkNewMoments() {
        try {
            const lastCheckMomentsTime = wx.getStorageSync('lastCheckMomentsTime');
            const res = await app.request()
                .get(`${config.requestUrl}user/getPortList`)
                .query({
                    lastCheckMomentsTime: lastCheckMomentsTime ? lastCheckMomentsTime : "2000-01-01 00:00:00"
                }).end();
            console.log("checkNewMoments", res);
            if (res.statusCode === 200) {
                if (res.data.unReadMomentsCount) {
                    wx.showTabBarRedDot({
                        index: 1
                    });
                } else {
                    wx.hideTabBarRedDot({
                        index: 1
                    });
                }
            } else {
                $wuxToast().show({
                    type: 'forbidden',
                    duration: 2000,
                    color: '#fff',
                    text: "调用接口时出现错误！"
                });
            }
        } catch (err) {
            console.log(err);
            $wuxToast().show({
                type: 'forbidden',
                duration: 2000,
                color: '#fff',
                text: err.toString()
            });
        }

    }


})
