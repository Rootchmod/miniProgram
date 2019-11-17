import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
  $wuxToast
} from '../../dist/index'

const app = getApp();

Page({
  data: {
    uploadUrl: `${config.requestUrl}upload`,
    uploadImageList: [],
    progress: 0,

    portIndex: 0,
    portList: [{
      label: "请选择...",
      value: ""
    }],
    typeIndex: 0,
    typeList: [{
      label: "请选择...",
      value: ""
    }],

    valueSwitch: false,
    product: {
      name: "",
      price: null,
      quantity: null,
      port: "",
      seller: "",
      shipName: "",
      chemicalProperties: "Fe: %, SiO₂: %, Al₂O₃: %, S: %, P: %, H₂O: %",
      remark: ""
    },

    isClickButton: false
  },
  onNameBlur(e) {
    console.log('onNameBlur', e)
    this.setData({
      ["product.name"]: e.detail.value
    });
  },
  onQuantityBlur(e) {
    if (e.detail.value) {
      let val = parseFloat(e.detail.value);
      if(!val){
        val = 0;
      }
      this.setData({
        ["product.quantity"]: val
      });
    }else{
      this.setData({
        ["product.quantity"]: 0
      });
    }

  },
  onPriceBlur(e) {
    if (e.detail.value) {
      let val = parseFloat(e.detail.value);
      if (!val) {
        val = 0;
      }
      this.setData({
        ["product.price"]: val
      });
    }else{
      this.setData({
        ["product.price"]: parseFloat(e.detail.value)
      });
    }
  },
  onSellerBlur(e) {
    console.log('onSellerBlur', e);
    this.setData({
      ["product.seller"]: e.detail.value
    });
  },
  onShipNameBlur(e) {
    console.log('onShipNameBlur', e)
    this.setData({
      ["product.shipName"]: e.detail.value
    });
  },
  //*************姜洁************
  onChemicalPropertiesBlur(e) {
    console.log('onChemicalPropertiesBlur', e)
    this.setData({
      ["product.chemicalProperties"]: e.detail.value
    });
  },
  onRemarkBlur(e) {
    console.log('onRemarkBlur', e)
    this.setData({
      ["product.remark"]: e.detail.value
    });
  },

  onChange(e) {
    console.log('onChange', e)
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0
      });
      wx.showLoading();
    } else if (file.status === 'done') {
      console.log("onchange done");
    } else if (file.status === 'remove') {
      console.log("onchange Remove");
      this.setData({
        uploadImageList: this.data.uploadImageList.filter(p => p !== e.detail.file.res.data)
      });
    }
  },
  onSuccess(e) {
    console.log('onSuccess', e)
  },
  onFail(e) {
    console.log('onFail', e)
  },
  onComplete(e) {
    console.log('onComplete', e);
    wx.hideLoading();
    this.setData({
      uploadImageList: this.data.uploadImageList.concat(e.detail.data)
    });
  },
  onProgress(e) {
    console.log('onProgress', e)
    this.setData({
      progress: e.detail.file.progress,
    });
  },
  onPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    });
  },

  onSwitchChange(e) {
    this.setData({
      valueSwitch: e.detail.value
    });
  },

  onTypeValueChange(e) {
    console.log("onTypeValueChange", e);
    const index = parseInt(e.detail.value);
    this.setData({
      ["product.type"]: this.data.typeList[index].value,
      ["product.name"]: this.data.typeList[index].label,
      typeIndex: index
    });
  },
  onPortValueChange(e) {
    console.log("onPortValueChange", e);
    const index = parseInt(e.detail.value);
    this.setData({
      ["product.port"]: this.data.portList[index].value,
      portIndex: index
    });
  },
  //发表按钮提示
  onError() {
    $wuxToast().show({
      type: 'Asterisk',
      duration: 1500,
      color: '#ff0000',
      text: '此项必须填写'
    });
  },

  async onRightClick(e) {
    console.log('onClick', e);
    this.setData({
      isClickButton: true
    });

    if (!this.data.product.name || !this.data.product.quantity || !this.data.product.price || !this.data.product.port || !this.data.product.seller || !this.data.product.shipName || !this.data.product.chemicalProperties) {
      return;
    }
    if (e.detail.type === 'right') {

      if (this.data.uploadImageList.length <= 0) {
        console.warn("no images")
        $wuxToast().show({
          type: 'forbidden',
          duration: 2000,
          color: '#ff0000',
          text: "请至少上传一张图片."
        });
        return;
      }

      const page = this;
      try {
        var userid = wx.getStorageSync('user_Id')
        const res = await app.request()
          .post(`${config.requestUrl}inventory/postInventory`)
          .query({
            ...page.data.product,
            ImageList: page.data.uploadImageList,
            syncToKq: page.data.valueSwitch,
            userId: userid
          }).end();
        console.log("postInventory", res);
        if (res.statusCode === 200 && res.data) {
          wx.showToast({
            title: '发布成功!',
            icon: 'success',
            duration: 1000,
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000);
            }
          });
        } else {
          $wuxToast().show({
            type: 'forbidden',
            duration: 2000,
            color: '#fff',
            text: "发布失败"
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
  },


  onReady() {
    this.getPortAndTypeList();
  },

  async getPortAndTypeList() {
    const page = this;
    var userid = wx.getStorageSync('user_Id')
    try {
      const res = await app.request()
        .get(`${config.requestUrl}inventory/getPortAndTypeList`)
        .query({
          userId: userid
        }).end();
      console.log("getPortAndTypeList", res);
      if (res.statusCode === 200 && res.data) {
        wx.stopPullDownRefresh();
        page.setData({
          portList: page.data.portList.concat(res.data.portList),
          typeList: page.data.typeList.concat(res.data.typeList),
          ["product.seller"]: res.data.companyName
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
  }

})