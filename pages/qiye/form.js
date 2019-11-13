import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();


Page({
    data: {
        uploadHeader: {
            'content-type': 'application/text'
        },
       
        uploadUrl: `${config.requestUrl}upload`,
        picker: ['钢厂', '贸易', '期货'],
        index: null,
        logoUrl: "",
        pictureUrl: "",
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        type: "",
        buttonDisabled: true,
        nameFocus: false
    },
    // 姜洁
  onLoad: function (e){
    var that = this;
    var uid = wx.getStorageSync('user_Id');
    console.log(uid);
    const res =  app.request()
      .get(`${config.requestUrl}User/getCompanyInfo`)
      .query({
        userId: uid
      }).end();
    res.then(rt=>{console.log(rt)});
  },
  //结束


    PickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value,
            type: this.data.picker[parseInt(e.detail.value)]
        });
    },

    nameOnBlur(e) {
        console.log("nameOnBlur,e", e);
        this.setData({
            name: e.detail.value
        });
        if (e.detail.value) {
            this.checkCompanyExists(e.detail.value);
        }
    },

    async checkCompanyExists(companyName) {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}user/checkCompanyExists`)
                .query({
                    companyName
                }).end();
            console.log("checkCompanyExists", res);
            if (res.statusCode === 200) {
                if (res.data.companyName) {
                    $wuxToast().show({
                        type: 'forbidden',
                        duration: 2000,
                        color: '#fff',
                        text: "该公司已经存在!"
                    });
                    page.setData({
                        nameFocus: true
                    });
                } else {
                    page.setData({
                        nameFocus: false
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

    },

    addressOnBlur(e) {
        console.log("addressOnBlur,e", e);
        this.setData({
            address: e.detail.value
        });
    },
    phoneNumberOnBlur(e) {
        console.log("phoneNumberOnBlur,e", e);
        this.setData({
            phoneNumber: e.detail.value
        });
    },
    descriptionOnBlur(e) {
        console.log("descriptionOnBlur,e", e);
        this.setData({
            description: e.detail.value
        });
    },

    onLogoUploadChange(e) {
        console.log('onLogoUploadChange', e)
        const {
            file
        } = e.detail
        if (file.status === 'uploading') {
            this.setData({
                progress: 0,
            })
            wx.showLoading()
        } else if (file.status === 'done') {
            this.setData({
                logoUrl: file.url,
            })
        } else if (file.status === 'remove') {
            this.setData({
                logoUrl: "",
            });
        }
    },
    onLogoUploadSuccess(e) {
        console.log('onLogoUploadSuccess', e)
    },
    onLogoUploadFail(e) {
        console.log('onLogoUploadFail', e)
    },
    onLogoUploadComplete(e) {
        console.log('onLogoUploadComplete', e)
        wx.hideLoading();
        this.setData({
            logoUrl: e.detail.data
        });
    },
    onLogoUploadPreview(e) {
        console.log('onLogoUploadPreview', e)
        const {
            file,
            fileList
        } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },

    onPictureUploadChange(e) {
        console.log('n', e)
        const {
            file
        } = e.detail
        if (file.status === 'uploading') {
            this.setData({
                progress: 0,
            })
            wx.showLoading()
        } else if (file.status === 'done') {
            this.setData({
                pictureUrl: file.url,
            })
        } else if (file.status === 'remove') {
            this.setData({
                pictureUrl: "",
            });
        }
    },
    onPictureUploadSuccess(e) {
        console.log('onPictureUploadSuccess', e)
    },
    onPictureUploadFail(e) {
        console.log('onPictureUploadFail', e)
    },
    onPictureUploadComplete(e) {
        console.log('onPictureUploadComplete', e)
        wx.hideLoading();
        this.setData({
            pictureUrl: e.detail.data
        });
    },
    onPictureUploadPreview(e) {
        console.log('onPictureUploadPreview', e)
        const {
            file,
            fileList
        } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },

    async buttonOnClick() {
        const {
            logoUrl,
            name,
            address,
            phoneNumber,
            type,
            nameFocus
        } = this.data;

        if (nameFocus) {
            $wuxToast().show({
                type: 'forbidden',
                duration: 2000,
                color: '#fff',
                text: "该公司已经存在!"
            });
            return;
        }

        if (!(logoUrl && name && address && phoneNumber && type)) {
            $wuxToast().show({
                type: 'forbidden',
                duration: 2000,
                color: '#fff',
                text: "信息填写不完整"
            });
            return;
        }
     
        //const page = this;   姜洁
  
      var uid = wx.getStorageSync('user_Id');
      console.log(uid);
      console.log('变化');
        try {
            const res = await app.request()
                .post(`${config.requestUrl}user/companyRegister`)
                .query({
                    ...this.data,
                    userId: uid
                }).end();
          console.log(res.statusCode+'niha')
  
            if (res.statusCode === 200 && res.data) {
                app.globalData.companyId = res.data;
          
                $wuxToast().show({
                    type: 'success',
                    duration: 2000,
                    color: '#fff',
                    text: "提交成功!请等待审核",
                    success:()=> {
                      
                      // wx.navigateTo({
                      //   "url": "/pages/wode/index"
                      // });
                    }
                });

                setTimeout(()=>{
                  // wx.navigateBack({
                  //   delta:1
                  // });
                  wx.reLaunch({
                    url: '/pages/wode/index',
                  })
                },1000);
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

    selectableOnChange(e) {
        console.log("selectableOnChange", e);
        this.setData({
            buttonDisabled: !e.detail.checked
        });
    },


    onReady() {
        this.checkUserCompanyStatus();
    },

    async checkUserCompanyStatus() {
        //const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}user/checkUserCompanyStatus`)
                .query({
                    lastCheckMomentsTime: "2000-01-01 00:00:00",
                    userId: app.globalData.userId
                }).end();
            console.log("checkUserCompanyStatus", res);
          console.log(res.data.companyName);
          // 存储公司是否注册缓存
          // wx.setStorageSync('compName', res.data.companyName);
          // console.log(compName+'*******');
          
          // 
          console.log('书本');
          console.log(res.statusCode);
          console.log(res.data,11111);
            if (res.statusCode === 200 && res.data) {
                wx.stopPullDownRefresh();//停止当前页面下拉刷新
                const companyName = res.data.companyName;
                if (companyName) {
                    $wuxToast().show({
                        type: 'forbidden',
                        duration: 1000,
                        color: '#ff0000',
                        text: `您已经绑定<${companyName}>`,
                        success() {
                            wx.redirectTo({
                                url: `/pages/qiye/xiugaixinxi`
                            });
                        }
                    });
                }
            } else {
                $wuxToast().show({
                    type: 'forbidden',
                    duration: 2000,
                    color: '#fff',
                    text: "调用接口时出现错误！",
                    success() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        } catch (err) {
            console.log(err);
            $wuxToast().show({
                type: ' ',
                duration: 2000,
                color: '#fff',
                text: err.toString()
            });
        }
    },

})
