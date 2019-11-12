import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();


Page({
    data: {
        noticeList: [{
                noticeType: -2,
                isRead: false,
                title: "系统通知",
                content: "您的入驻审核已通过！",
                receiveTime: "22:20 07-10"
            },
            {
                noticeType: -1,
                isRead: false,
                image: "https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png",
                counts: 10,
                avatarList: ["https://ossweb-img.qq.com/images/lol/web201310/skin/big10004.jpg",
                    "https://ossweb-img.qq.com/images/lol/web201310/skin/big10003.jpg",
                    "https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg",
                    "https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg"
                ]
            },
            {
                noticeType: 0
            },
            {
                noticeType: 2,
                isRead: true,
                title: "系统通知",
                content: "您的入驻审核已通过！",
                receiveTime: "22:20 07-01"
            },
            {
                noticeType: 2,
                isRead: true,
                title: "系统通知",
                content: "您的入驻审核已通过！",
                receiveTime: "22:20 07-01"
            },
            {
                noticeType: 1,
                isRead: true,
                image: "https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png",
                counts: 15,
                avatarList: ["https://ossweb-img.qq.com/images/lol/web201310/skin/big10004.jpg",
                    "https://ossweb-img.qq.com/images/lol/web201310/skin/big10003.jpg",
                    "https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg",
                    "https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg"
                ]
            }
        ],
        searchTime: "2019-08-15 15:21:00",
        pageIndex: 1
    },
    /*
        // ListTouch触摸开始
        ListTouchStart(e) {
            this.setData({
                ListTouchStart: e.touches[0].pageX
            })
        },

        // ListTouch计算方向
        ListTouchMove(e) {
            this.setData({
                ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
            })
        },

        // ListTouch计算滚动
        ListTouchEnd(e) {
            if (this.data.ListTouchDirection == 'left') {
                this.setData({
                    modalName: e.currentTarget.dataset.target
                })
            } else {
                this.setData({
                    modalName: null
                })
            }
            this.setData({
                ListTouchDirection: null
            })
        },
    */

    gotoMyMoments() {
        wx.redirectTo({
            url: "/pages/kuangquan/wodeDongtai"
        });
    },

    onPullDownRefresh() {
        this.setData({
            pageIndex: 1,
            searchTime: app.formatDate(new Date())
        }, () => this.getMessageList(true))
    },
    onReady() {
        this.setData({
            searchTime: app.formatDate(new Date()),
            pageIndex: 1
        }, () => this.getMessageList(true));
    },

    async getMessageList(refresh) {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}user/getMessageList`)
                .query({
                    rows: 10,
                    page: page.data.pageIndex,
                    searchTime: page.data.searchTime,
                    userId: app.globalData.userId
                }).end();
            console.log("getMessageList", res);
            if (res.statusCode === 200 && res.data) {
                wx.stopPullDownRefresh();
                page.setData({
                    noticeList: refresh ? res.data : page.data.noticeList.concat(res.data),
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

})
