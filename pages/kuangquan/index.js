import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
  $wuxToast
} from '../../dist/index'
var useinfo = wx.getStorageSync('userinfo');
const app = getApp();

Page({
  data: {
    array: [],
    modalName: null,
    replyText: "",
    replyingPostId: null,
    replyingCommentId: null,
    searchTime: "2019-08-15 15:21:00",
    pageIndex: 1
  },

  onReady() {
    this.setData({
      searchTime: app.formatDate(new Date()),
      pageIndex: 1
    }, () => this.getMomentsList(true));
  },

  async getMomentsList(refresh) {
    const page = this;
    let userId = wx.getStorageSync("userId");
    try {
      const res = await app.request()
        .get(`${config.requestUrl}moments/getMomentsList`)
        .query({
          rows: 10,
          page: page.data.pageIndex,
          searchTime: page.data.searchTime,
          userId: userId
        }).end();
      console.log("getMomentsList", res);//打印矿圈数据列表

      if (res.statusCode === 200 && res.data) {
        wx.stopPullDownRefresh();
        wx.hideTabBarRedDot({
          index: 1
        });
        wx.setStorage({
          key: "lastCheckMomentsTime",
          data: app.formatDate(new Date())
        });
        page.setData({
          nickName: useinfo,
         
          array: refresh ? res.data : page.data.array.concat(res.data),
          pageIndex: refresh ? 2 : page.data.pageIndex + 1
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

  onReachBottom() {
    console.log("onReachBottom")
    this.getMomentsList();
  },

  onPullDownRefresh() {
    this.setData({
      pageIndex: 1,
      searchTime: app.formatDate(new Date())
    }, () => this.getMomentsList(true))
  },

  onRightClick(e) {
    console.log('onClick', e)
    if (e.detail.type === 'right') {
      let companyId = wx.getStorageSync("CompanyId");
      if (!companyId) {
        wx.switchTab({
          url: '/pages/wode/index'
        });
      } else {
        wx.navigateTo({
          "url": "/pages/kuangquan/fabudongtai"
        });
      }
    }
  },

  previewImage(e) {
    const {
      currentIndex,
      current
    } = e.currentTarget.dataset;
    const urls = this.data.array[currentIndex].imageUrls;

    wx.previewImage({
      current,
      urls,
    });
  },

  async doLike(e) {
    console.log("doLike", e);
    let companyId = wx.getStorageSync("CompanyId");
    if (!companyId) {
      $wuxToast().show({
        type: 'forbidden',
        duration: 1500,
        color: '#fff',
        text: "请绑定入驻公司"
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/wode/index'
        });
      }, 1500);
      return;
    }
    const postId = e.currentTarget.dataset.postId;
    const page = this;
    try {
      const res = await app.request()
        .post(`${config.requestUrl}moments/doLike`)
        .query({
          postId,
          userId: wx.getStorageSync("userId")
        }).end();
      console.log("doLike", res);
      if (res.statusCode === 200 && res.data) {
        const arrIndex = page.data.array.findIndex(p => p.id === postId);
        page.setData({
          ["array[" + arrIndex + "].isLike"]: res.data.isLike,
          ["array[" + arrIndex + "].likeCount"]: res.data.isLike ? page.data.array[arrIndex].likeCount + 1 : page.data.array[arrIndex].likeCount - 1
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
  async doCommentLike(e) {
    console.log("doCommentLike", e);
    if (!app.globalData.companyId) {
      wx.switchTab({
        url: '/pages/wode/index'
      });
      return;
    }
    const {
      postId,
      parentPostId
    } = e.currentTarget.dataset;
    const page = this;
    try {
      const res = await app.request()
        .post(`${config.requestUrl}moments/doLike`)
        .query({
          postId,
          userId: app.globalData.userId
        }).end();
      console.log("doCommentLike", res);
      if (res.statusCode === 200 && res.data) {
        const postIndex = page.data.array.findIndex(p => p.id === parentPostId);
        const commentIndex = page.data.array[postIndex].commentList.findIndex(p => p.id === postId);
        page.setData({
          ["array[" + postIndex + "].commentList[" + commentIndex + "].isLike"]: res.data.isLike,
          ["array[" + postIndex + "].commentList[" + commentIndex + "].likeCount"]: res.data.isLike ?
            page.data.array[postIndex].commentList[commentIndex].likeCount + 1 : page.data.array[postIndex].commentList[commentIndex].likeCount - 1
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

  showModal(e) {
    console.log("showmodal", e);
    let companyId = wx.getStorageSync("CompanyId");
    if (!companyId) {
      $wuxToast().show({
        type: 'forbidden',
        duration: 1500,
        color: '#fff',
        text: "请绑定入驻公司"
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/wode/index'
        });
      }, 1500);
      return;
    }
    const {
      postId,
      parentPostId,
      postIndex,
      commentIndex
    } = e.currentTarget.dataset;
    this.setData({
      modalName: "bottomModal",
      replyingPostId: parentPostId,
      replyingCommentId: postId,
      replyingPostIndex: postIndex,
      replyingCommentIndex: commentIndex,
      ["array[" + postIndex + "].isCommentShow"]: true
    });
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      replyingPostId: null,
      replyingCommentId: null,
      replyText: ""
    });
  },

  async writeComment(e) {
    console.log("writeComment", e);
    const {
      replyingPostId,
      replyingCommentId,
      replyingPostIndex,
      replyingCommentIndex,
      replyText
    } = this.data;
    if (!replyText.replace(/(^\s*)|(\s*$)/g, "")) {
      $wuxToast().show({
        type: 'forbidden',
        duration: 2000,
        color: '#fff',
        text: "请输入内容"
      });
      return;
    }
    if (!replyingPostId) {
      console.log("replyingPostId is null.");
      return;
    }
    const page = this;
    try {
      const res = await app.request()
        .post(`${config.requestUrl}moments/writeComment`)
        .query({
          postId: replyingCommentId ? replyingCommentId : replyingPostId,
          replyText,
          userId: wx.getStorageSync("userId")
        }).end();
      console.log("writeComment", res);
      if (res.statusCode === 200 && res.data) {
        page.hideModal();
        if (replyingCommentId) {
          page.setData({
            ["array[" + replyingPostIndex + "].commentList[" + replyingCommentIndex + "].subCommentList"]: page.data.array[replyingPostIndex].commentList[replyingCommentIndex].subCommentList ? page.data.array[replyingPostIndex].commentList[replyingCommentIndex].subCommentList.concat(res.data) : [].concat(res.data)
          });
        } else {
          page.setData({
            ["array[" + replyingPostIndex + "].commentList"]: page.data.array[replyingPostIndex].commentList.concat(res.data),
            ["array[" + replyingPostIndex + "].commentCount"]: page.data.array[replyingPostIndex].commentCount + 1
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

  navigateToRecentInventory(e) {
    const {
      productTypeId,
      postUserId,
      productName
    } = e.currentTarget.dataset;
    wx.navigateTo({
      "url": `/pages/chaxunangangkou/recentInventory?productTypeId=${productTypeId}&postUserId=${postUserId}&productName=${productName}`
    });
  },

  replyInput(e) {
    this.setData({
      replyText: e.detail.value
    });
  },

  qiyexiangqing() {
    wx.navigateTo({
      url: "/pages/kuangquan/qiyexiangqing"
    });
  }
})
