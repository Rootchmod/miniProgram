import Poster from '../../dist/poster/poster/poster';
import {
    $wuxToast
} from '../../dist/index'

import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';

const app = getApp();


const posterConfig = {
    width: 669, //750
    height: 1080, //1334    
    images: [{
        width: 669,
        height: 1080,
        x: 0,
        y: 0,
      url: 'https://wechatapi.jlyk.net/images/posterbackground.png',
    }, {
        width: 120,
        height: 120,
        x: 480,
        y: 900,
        url: 'https://wechatapi.jlyk.net/images/qrcode.jpg',
    }],
    texts: [{
        x: 200,
        y: 90,
        baseLine: 'top',
        text: '青岛鑫澳矿业1',
        fontSize: 40,
        fontFamily: "黑体",
        fontWeight: "bold"
    }, {
        x: 380,
        y: 620,
        baseLine: 'bottom',
        text: (new Date()).getFullYear() + "-" + ("0" + ((new Date()).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date()).getDate()).slice(-2),
        fontSize: 24,
        fontFamily: "黑体"
    }]
};


Page({
    data: {
        checkbox: [],
        disabledStatus: [false, false, false, false, false],
        visibleLandscape: false,
        srcLandscape: "",
        products: [ ],
        posterConfig
    },

    onCheckboxChange(e) {
        const {
            value,
            index,
            checked
        } = e.detail
        const data = this.data.checkbox;
        const index0 = data.indexOf(value);
        const checkbox = index0 === -1 ? [...data, value] : data.filter((n) => n !== value);

        this.setData({
            checkbox,
            ["products[" + index + "].checked"]: checked
        });

        console.log("checkbox", checkbox);

        if (checkbox.length >= 4) {
            const disabledStatus = this.data.disabledStatus.map((currentValue, idx) => {
                console.log("idx", idx)
                return checkbox.indexOf((idx + 1).toString()) < 0;
            });
            console.log("disabledStatus", disabledStatus);
            this.setData({
                disabledStatus
            });
            return;
        } else {
            this.setData({
                disabledStatus: new Array(this.data.products.length).fill(false)
            })
        }

    },

    onCreatePoster() {
        const checkedProductsArray = this.data.products.filter(p => p.checked).map((currentValue, index) => {
            return {
                x: 160,
                y: 300 + 60 * index,
                baseLine: 'top',
                fontFamily: "黑体",
                text: [{
                        text: currentValue.name.substring(0, 5),
                        fontSize: 28
                    },
                    {
                        text: currentValue.quantity + "万吨",
                        marginLeft: 60,
                        fontSize: 28
                    },
                    {
                        text: currentValue.port,
                        marginLeft: 60,
                        fontSize: 28
                    }
                ]
            };
        });

        if (checkedProductsArray.length <= 0) {
            $wuxToast().show({
                type: 'forbidden',
                duration: 1500,
                color: '#fff',
                text: '请先选择库存'
            });
            return;
        }

        const pt = this.data.posterConfig.texts.concat(checkedProductsArray);

        this.setData({
            ["posterConfig.texts"]: pt
        }, () => {
            Poster.create(true);
        });
    },

    onPosterSuccess(e) {
        console.log("onPosterSuccess", e);
        const {
            detail
        } = e;
        this.setData({
            srcLandscape: detail,
            visibleLandscape: true,
            posterConfig
        });
    },

    onPosterFail(err) {
        console.error(err);
    },

    onCloseLandscape() {
        this.setData({
            visibleLandscape: false
        });
    },

    savePoster() {
        const filePath = this.data.srcLandscape;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            console.log('授权成功');
                            wx.saveImageToPhotosAlbum({
                                filePath,
                                success(res) {
                                    console.log(res);
                                    $wuxToast().show({
                                        type: 'text',
                                        duration: 1500,
                                        color: '#fff',
                                        text: '保存成功'
                                    });
                                },
                                fail(err) {
                                    console.warn(err);
                                    $wuxToast().show({
                                        type: 'text',
                                        duration: 1500,
                                        color: '#fff',
                                        text: '保存失败'
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },


    onReady() {
        this.getMyCompanyAndInventory();
    },

    async getMyCompanyAndInventory() {
        const page = this;
        var userid = wx.getStorageSync('user_Id');
        try {
            const res = await app.request()
                .get(`${config.requestUrl}inventory/getMyCompanyAndInventory`)
                .query({
                  userId: userid
                }).end();
            console.log("getMyCompanyAndInventory", res);
            if (res.statusCode === 200 && res.data) {
                wx.stopPullDownRefresh();
                page.setData({
                    ["posterConfig.texts[0].text"]: res.data.companyName,
                    products: res.data.products
                });
            } else {
                $wuxToast().show({
                    type: 'forbidden',
                    duration: 2000,
                    color: '#fff',
                    text: res
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
