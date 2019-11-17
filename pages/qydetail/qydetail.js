Page({
  data:{

  },

  onLoad:function(e){
    console.log(e);
    var that = this;
    
    var id = e.id;
    wx.request({
      url: 'https://wechatapi.jlyk.net/api/user/getCompanyInfo',
      data:{
        userId: id,
      },
      success:function(res){
        console.log(res);
        that.setData({
          detail: res.data.myCompany
        })
      }
    })
  }
})