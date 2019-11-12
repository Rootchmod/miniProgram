import regeneratorRuntime from '../dist/runtime';
import config from '../config';

const app = getApp();

Page({
    wxLogin() {
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    console.log("wx.login res", res);
                    if (res.code) {
                        resolve(res.code);
                    } else {
                        console.log('登录失败！' + res.errMsg);
                        $wuxToast().show({
                            type: 'forbidden',
                            duration: 2000,
                            color: '#fff',
                            text: '登录失败！' + res.errMsg
                        });
                        reject(res.errMsg);
                    }
                }
            });
        })
    },

    async onReady() {
        wx.showLoading({
            title: '加载中',
        });

        const code = await this.wxLogin();

        try {
            const res = await app.request()
                .get(`${config.requestUrl}user/checkUserExists`)
                .query({
                    code
                })
                .end();
            console.log("checkUserExists res", res);
            wx.hideLoading();
            if (res.data.userId) {
                app.globalData.userId = res.data.userId;
                app.globalData.companyId = res.data.companyId;
                wx.switchTab({
                    url: '/pages/chaxunangangkou/index',
                    success: function () {
                        console.log("wx.switchTab success")
                    },
                    fail: function (e) {
                        console.log("wx.switchTab fail", e)
                    }
                });
            } else {
              wx.switchTab({
                url: '/pages/chaxunangangkou/index',
                success: function () {
                  console.log("wx.switchTab success")
                },
                fail: function (e) {
                  console.log("wx.switchTab fail", e)
                }
              });
                // wx.navigateTo({
                //     url: "/pages/login/index"
                // });
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
