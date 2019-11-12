import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';

import {
    $wuxCountDown
} from '../../dist/index';
import {
    $wuxToast
} from '../../dist/index'

const isTel = value => !/^1[34578]\d{9}$/.test(value)
const app = getApp();

Page({
    data: {
        opeid:"",
        code: "",
        phoneNumber: "",
        verificationCode: "",
        verificationCodeInput: "",
        error: true,
        openid: "",
        userid: app.globalData.userId,
        visibleLandscape: true
    },

    onPhoneNumberChange(e) {
        console.log('onChange', e)
        this.setData({
            error: isTel(e.detail.value),
            phoneNumber: e.detail.value,
        })
    },
    onPhoneNumberFocus(e) {
        this.setData({
            error: isTel(e.detail.value),
        })
        console.log('onFocus', e)
    },
    onPhoneNumberBlur(e) {
        this.setData({
            error: isTel(e.detail.value),
        })
        console.log('onBlur', e)
    },
    onPhoneNumberConfirm(e) {
        console.log('onConfirm', e)
    },
    onPhoneNumberClear(e) {
        console.log('onClear', e)
        this.setData({
            error: true,
            phoneNumber: "",
        })
    },
    onPhoneNumberError() {
        wx.showModal({
            title: 'Please enter 11 digits',
            showCancel: !1,
        })
    },

    onVerificationCodeChange(e) {
        console.log('onVerificationCodeChange', e)
        this.setData({
            verificationCodeInput: e.detail.value,
        })
    },

    onReady() {
        const page = this;
        wx.showLoading({
            title: '加载中',
        });
        
      wx.login({
      
            success(res) {
              console.log(res);
                console.log("wx.login res", res);
                var codes = res.code
                if (res.code) {
                  
                  page.setData({
                      code: res.code
                  });
                  var that = this;
                  wx.request({
                    url: 'https://wechatapi.jlyk.net/api/user/getopenidbycode',

                    data:{
                      'code': codes
                    },
                    success:function(e){
                      console.log(e);
                      page.setData({
                        opeid:e.data
                      })
                      console.log('叔叔叔');
                     
                      wx.setStorageSync("oids", e.data);
                      console.log(e.data + '登陆登陆');
                    }
                  })
                 
                  // wx.switchTab({
                  //   url: '/pages/wode/index'
                  // })
                    wx.hideLoading();
                    
                } else {
                    console.log('登录失败！' + res.errMsg);
                    $wuxToast().show({
                        type: 'forbidden',
                        duration: 2000,
                        color: '#fff',
                        text: '登录失败！' + res.errMsg
                    });
                }
            }
        });
    },
    // 隐藏返回首页图标
  // onShow:function() {
  //   wx.hideHomeButton({
  //     success: () => {
  //       console.log(1);
  //     }
  //   })
  // },
    async onSendVerificationCode() {
        if (this.data.error) {
            console.log("phoneNumber error");
            $wuxToast().show({
                type: 'forbidden',
                duration: 1000,
                color: '#fff',
                text: '手机号码格式不正确'
            });
            return;
        }
        console.log("onSendVerificationCode");
        if (this.c2 && this.c2.interval) return !1;
        console.log("开始倒计时");
        this.c2 = new $wuxCountDown({
            date: +(new Date) + 60000,
            onEnd() {
                this.setData({
                    c2: '重新获取验证码',
                })
            },
            render(date) {
                const sec = this.leadingZeros(date.sec, 2) + ' 秒 '
                date.sec !== 0 && this.setData({
                    c2: sec,
                })
            },
        });

        try {
            const res = await app.request()
                .get(`${config.requestUrl}wechat/SendVerificationCode`)
                .query({
                    phoneNumber: this.data.phoneNumber
                })
                .end();
            console.log("SendVerificationCode res", res);
            this.setData({
                verificationCode: res.data.toString()
            });
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
//code
    async getPhoneNumber(e) {
        console.log(e);
        const code = this.data.code;
        if (!code) {
            console.error("code empty.")
            return;
        }
        if (!e.detail.encryptedData) {
            $wuxToast().show({
                type: 'forbidden',
                duration: 2000,
                color: '#fff',
                text: e.detail.errMsg
            });
            return;
        }
        const res = await app.request()
            .post(`${config.requestUrl}user/GetPhoneNumberAndRegister`)
            .query({
                code: code,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
                ...this.data.userInfo
            })
            .end();
        console.log("phoneNumber res", res);
      
     
        // 保存该用户到数据库
        wx.switchTab({
            url: "/pages/chaxunangangkou/index"
        });
    },
// 登陆
    async userLogin() {
        console.log("verificationCodeInput", this.data.verificationCodeInput);
        console.log("verificationCode", this.data.verificationCode);
        if (this.data.verificationCode === this.data.verificationCodeInput) {
            // do login
          //console.log(this.data.code);
            try {
                const res1 = await app.request()
                    .post(`${config.requestUrl}user/register`)
                    .query({
                        openid: this.data.opeid, 
                        phoneNumber: this.data.phoneNumber,
                        ...this.data.userInfo
                    })
                    .end();
                 
              console.log(res1);
              console.log('笨笨笨');
                if (res1.statusCode === 200 && res1.data) {
                    app.globalData.userId = res1.data;
                  console.log(app.globalData.userId+"000000");
                  // 存储缓存
                  wx.setStorageSync("user_Id", res1.data)
                    wx.switchTab({
                      url: "/pages/chaxunangangkou/index"
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
            return;
        }
        $wuxToast().show({
            type: 'forbidden',
            duration: 2000,
            color: '#fff',
            text: "验证码错误!"
        });
        return;
    },


    vcode() {
        if (this.c2 && this.c2.interval) return !1
        this.c2 = new $wuxCountDown({
            date: +(new Date) + 60000,
            onEnd() {
                this.setData({
                    c2: '重新获取验证码',
                })
            },
            render(date) {
                const sec = this.leadingZeros(date.sec, 2) + ' 秒 '
                date.sec !== 0 && this.setData({
                    c2: sec,
                })
            },
        })
    },
// 授权
    bindGetUserInfo(e) {
      var that = this;
        console.log(e);
        console.log('大帅');
        if (e.detail.userInfo) {
            that.setData({
              visibleLandscape: false,
              userInfo: e.detail.userInfo,
            });
          wx.setStorageSync("userinfo", e.detail.userInfo);
          console.log(e.detail.userInfo);
          let code = that.data.code;
          // RootChmod 校验用户是否已存在
          // const res11 = app.request()
          //   .get(`${config.requestUrl}User/checkUserExists`)
          //   .query({ code })
          //   .end();

          // res11.then(rt => {
          //   // RootChmod 如果用户存在则自动登陆
          //   rt = rt.data;
          //   if (rt.userId) {
          //     wx.setStorageSync("companyId", rt.companyId);
          //     wx.setStorageSync("user_Id", rt.userId);
          //     app.globalData.userId = rt.userId;
          //     wx.switchTab({
          //       url: "/pages/wode/index"
          //     });
          //   }
          // })
        } else {
            $wuxToast().show({
                type: 'forbidden',
                duration: 3000,
                color: '#fff',
                text: "用户拒绝"
            });
        }
    },

})
