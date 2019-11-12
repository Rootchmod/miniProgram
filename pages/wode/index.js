import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();


Page({
    data: {
        compnyname:'',//公司名称
        userInfo: app.globalData.userInfo,
        companyName: "用户名",
        logo: "../../assets/images/iconfont-empty.png",
        unReadMessageCount: ''
    },
//库存管理
    kucun(e) {
      var name = e.currentTarget.dataset.name; //获取用户名称
      var compnyname = e.currentTarget.dataset.compnyname;//获取公司名称
      if (compnyname == null || compnyname == '') {
        wx.showToast({
          title: '您还未入驻企业',
          icon: 'none',
          duration: 1000
        })
      }else{
        wx.navigateTo({
          "url": "/pages/wode/kucun"
        });
      }
  
    },
  // 库存分享
  kucunfenxiang(e) {
    var name = e.currentTarget.dataset.name; //获取用户名称
    var compnyname = e.currentTarget.dataset.compnyname;//获取公司名称
    if (compnyname == null || compnyname == '') {
      wx.showToast({
        title: '您还未入驻企业',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        "url": "/pages/wode/kucunfenxiang"
      });
    }


  },
  // 我的动态
  dynamic:function(e){
    var compnyname = e.currentTarget.dataset.compnyname;//获取公司名称
    if (compnyname == null || compnyname ==''){
      wx.showToast({
        title: '您还未入驻企业',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.navigateTo({
        "url": "/pages/kuangquan/wodeDongtai"
      });
      
    }
  },
  //修改信息
  modify:function(e){
    var compnyname = e.currentTarget.dataset.compnyname;//获取公司名称
    var address = e.currentTarget.dataset.address;//公司地址
    var phone = e.currentTarget.dataset.phone;//手机
    var types = e.currentTarget.dataset.types; //类型
    console.log(types+'假发');
    if (compnyname == null || compnyname == '') {
      wx.showToast({
        title: '您还未入驻企业',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        "url": "/pages/qiye/xiugaixinxi"
      });
     
    }
  },

// 消息中心
  msggess:function(e){
    var compnyname = e.currentTarget.dataset.compnyname;//获取公司名称
    if (compnyname == null || compnyname == '') {
      wx.showToast({
        title: '您还未入驻企业',
        icon: 'none',
        duration: 1000
      })
      

    } else {
      wx.navigateTo({
        "url": "/pages/notice/list"
      });
    }
  },

//企业入驻
  settled:function(e){
    console.log("000000000000000000000000000000-----")
    console.log(e);
    var compnyname = e.currentTarget.dataset.compnyname;//获取公司名称
    var name = e.currentTarget.dataset.name; //获取用户名称   
    console.log(compnyname+"zhang"+name.length+"=======")
  
    if(name == null || name == ''){
 
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1000
      })
      return false;
      
      
    } else {
      if (compnyname != null || compnyname!='') {
        wx.showToast({
          title: '您已绑定公司',
          icon: 'loading',
          duration: 500
        })
        return false;

      }else{
        setTimeout(function () {
          wx.reLaunch({
            url: '../qiye/form',
          })
        }, 500) 
      }
      

    }
  },

  // 点击登陆
  login:function(e){
    setTimeout(function () {
        wx.reLaunch({
        url: '../login/index',
      })
    }, 500)
  },
  //页面加载时
  onLoad: function (e) {
    var that = this;
    var userid = wx.getStorageSync('user_Id');
    var opid = wx.getStorageSync('oids');
    var compname = wx.getStorageSync('compname'); //获取公司名称
    console.log(compname);
    console.log('啥更新');
    var useinfo = wx.getStorageSync('userinfo');
    wx.request({
      url: 'https://wechatapi.jlyk.net/api/User/checkUserExists',
      data: {
        openid: opid
      },
      success: function (res) {
        console.log(res);
        console.log('草草');
        if (res.data.userId.length>0){
          console.log('已注册')
          that.setData({
            nickName: useinfo.nickName,
            avatarUrl: useinfo.avatarUrl
          })
        }else{
          console.log('未注册')
          that.setData({
            nickName: '',
            avatarUrl: that.data.logo
          })
        
        }
      }
    })
    console.log(userid +'书本')
    // 公司详情
    wx.request({
      url: 'https://wechatapi.jlyk.net/api/User/GetCompanyInfo',
      data: {
        userId: userid
      },
      
      success: function (e) {
        console.log(e);
        console.log('斐乐2');
        that.setData({
          compnyname: e.data.myCompany.name,
          detail:e.data.myCompany
        })
        
      }
    })

    
  },



  
    calculator() {
        wx.navigateTo({
            "url": "/pages/calculator/index"
        });
    },
    onShow() {
        
        this.checkMyCompanyStatus();
    },

    async checkMyCompanyStatus() {
        const page = this;
        const lastCheckMomentsTime = wx.getStorageSync('lastCheckMomentsTime');
        try {
          var userid = wx.getStorageSync('user_Id')
            const res = await app.request()
                .get(`${config.requestUrl}user/checkUserCompanyStatus`)
                .query({
                    lastCheckMomentsTime: lastCheckMomentsTime ? lastCheckMomentsTime : "2000-01-01 00:00:00",
                  userId: userid
                }).end();
            console.log("checkMyCompanyStatus", res);
           
            if (res.statusCode === 200) {
                if (!res.data.companyName) {
                    // wx.showModal({
                    //     title: '提示',
                    //     content: '您的微信尚未绑定任何公司，您想',
                    //     cancelText: "绑定公司",
                    //     confirmText: "公司入驻",
                    //     success(res) {
                    //         if (res.confirm) {
                    //             console.log('新公司入驻');
                    //             wx.navigateTo({
                    //                 "url": "/pages/qiye/form"
                    //             });
                    //         } else if (res.cancel) {
                    //             console.log('绑定现有公司');
                    //             wx.navigateTo({
                    //                 "url": "/pages/qiye/xiugaixinxi"
                    //             });
                    //         }
                    //     }
                    // });
                } else {
                    page.setData({
                        companyName: res.data.companyName,
                        logo: res.data.logo,
                        unReadMessageCount: res.data.unReadMessageCount
                    });
                    if (res.data.unReadMomentsCount) {
                        wx.showTabBarRedDot({
                            index: 1
                        });
                    } else {
                        wx.hideTabBarRedDot({
                            index: 1
                        });
                    }
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
