import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();


Page({
    data: {
        isOwner: false,

        actions: [{
            type: 'default',
            text: '取消',
        }, {
            text: '保存',
            type: 'primary',
        }],

        picker: ['钢厂', '贸易', '期货'],
        index: null,

        pickerCompany: [],
        indexCompany: -1,

        name: "",
        address: "",
        phoneNumber: "",
        type: "",
        description: "",

        originalName: "",
        nameFocus: false
    },
//页面加载
    // onLoad:function(e){
    //   var that = this;
    //   console.log(e);
    //   var type = e.types;//类型
    //   var address = e.address;//地址
    //   var compnyname = e.compnyname;//公司名称
    //   var phone = e.phone;//电话
    //   that.setData({
    //     type:type,
    //     address:address,
    //     compnyname: compnyname,
    //     phone: phone
    //   })
    // },





// 保存
    onAction(e) {
        console.log('onAction', e.detail)
        if (e.detail.action.type === "primary") {
            this.saveMyCompanyInfo();
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    async saveMyCompanyInfo() {
        const {
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

        if (!(name && address && phoneNumber && type)) {
            $wuxToast().show({
                type: 'forbidden',
                duration: 2000,
                color: '#fff',
                text: "信息填写不完整"
            });
            return;
        }

        //const page = this;
        try {
            const res = await app.request()
                .post(`${config.requestUrl}user/saveMyCompanyInfo`)
                .query({
                    ...this.data,
                    userId: app.globalData.userId
                }).end();
            console.log("saveMyCompanyInfo", res);
            if (res.statusCode === 200 && res.data) {
                app.globalData.companyId = res.data;
                $wuxToast().show({
                    type: 'success',
                    duration: 2000,
                    color: '#fff',
                    text: "提交成功!请等待审核",
                    success() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            } else {
                $wuxToast().show({
                    type: 'forbidden',
                    duration: 2000,
                    color: '#fff',
                    text: "公司名称不允许修改"
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

    nameBlur(e) {
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
                if (res.data.companyName && (res.data.companyName !== this.data.originalName)) {
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
                    text: "公司名称不允许修改！"
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
    addressBlur(e) {
        this.setData({
            address: e.detail.value
        });
    },
    phoneNumberBlur(e) {
        this.setData({
            phoneNumber: e.detail.value
        });
    },
    descriptionBlur(e) {
        this.setData({
            description: e.detail.value
        });
    },

    pickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value,
            type: this.data.picker[parseInt(e.detail.value)]
        });
    },
    pickerCompanyChange(e) {
        console.log(e);
        this.setData({
            indexCompany: e.detail.value,
            name: this.data.pickerCompany[parseInt(e.detail.value)]
        }, this.getOtherCompany);
    },

    async getOtherCompany() {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}user/getOtherCompany`)
                .query({
                    companyName: page.data.name,
                    userId: app.globalData.userId
                }).end();
            console.log("getOtherCompany", res);
            if (res.statusCode === 200 && res.data) {
                page.setData({
                    isOwner: res.data.isOwner,

                    index: page.data.picker.indexOf(res.data.type),

                    indexCompany: page.data.pickerCompany.indexOf(res.data.name),

                    name: res.data.name,
                    address: res.data.address,
                    phoneNumber: res.data.phoneNumber,
                    type: res.data.type,
                    description: res.data.description,

                  originalName: res.data.originalName
                });
                // if (!res.data.isOwner) {
                //     $wuxToast().show({
                //         type: 'forbidden',
                //         duration: 1000,
                //         color: '#fff',
                //         text: "您不是该公司的所有者!"
                //     });
                // }
            } else {
                $wuxToast().show({
                    type: 'forbidden',
                    duration: 2000,
                    color: '#fff',
                    text: "公司名称不允许修改！"
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

    onReady() {
        this.getCompanyInfo();
    },
// 公司详情
  
    async getCompanyInfo() {
        const page = this;
        var userid = wx.getStorageSync('user_Id')
        try {
          
            const res = await app.request()
                .get(`${config.requestUrl}user/getCompanyInfo`)
                .query({
                  userId: userid
                }).end();
            console.log("getCompanyInfo", res);
            if (res.statusCode === 200 && res.data) {
                page.setData({
                    isOwner: res.data.myCompany.isOwner,

                    index: page.data.picker.indexOf(res.data.myCompany.type),

                    pickerCompany: res.data.companyList,
                    indexCompany: res.data.companyList.indexOf(res.data.myCompany.name),

                    name: res.data.myCompany.name,
                    address: res.data.myCompany.address,
                    phoneNumber: res.data.myCompany.phoneNumber,
                    type: res.data.myCompany.type,
                    description: res.data.myCompany.description,

                    originalName: res.data.myCompany.name
                });
                // if (!res.data.myCompany.isOwner) {
                //     $wuxToast().show({
                //         type: 'forbidden',
                //         duration: 2000,
                //         color: '#fff',
                //         text: "您不是该公司的所有者!"
                //     });
                // }
            } else {
                $wuxToast().show({
                    type: 'forbidden',
                    duration: 2000,
                    color: '#fff',
                    text: "公司名称不允许修改！"
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
