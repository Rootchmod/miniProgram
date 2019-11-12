import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

import {
    $wuxGallery
} from '../../dist/index';

const app = getApp();

Page({
    data: {
        inventoryId: "",
        actions: [{
            type: 'default',
            text: '发私信',
        }, {
            text: '打电话',
            type: 'primary',
        }],
        product: {
            imageUrls: [
                'http://n.sinaimg.cn/translate/178/w600h378/20180903/Mvf8-hiqtcan6705225.jpg',
                'http://n.sinaimg.cn/translate/20170213/jzH3-fyamkqa5939268.jpg',
                'http://i0.hexunimg.cn/2012-12-02/148604446.jpg',
                'http://a0.att.hudong.com/47/19/01300000207820122010198953210.jpg',
            ],
            name: "矿石C",
            poster: "公司C",
            price: 800,
            quantity: 100,
            date: "2019-02-01",
            port: "青岛港",
            chemicalProperties: "Fe: 50%, SiO₂: 35%, Al₂O₃: 20%, S: 0%, P: 0%, H₂O: 50%",
            remark: "test",
            seller: "公司ABC",
            shipName: "船名ABC",
            posterId: "testGUID",
            posterPhoneNumber: "13370851680"
        }
    },

    onLoad(options) {
        this.setData({
            inventoryId: options.id
        });
        console.log(options);
    },

    onReady() {
        this.getDetails();
    },
    async getDetails() {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}inventory/getDetails`)
                .query({
                    id: page.data.inventoryId
                })
                .end();
            console.log("getDetails", res);
            if (res.statusCode === 200 && res.data) {
                page.setData({
                    product: res.data
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

    onAction(e) {
        console.log('onAction', e.detail)
        switch (e.detail.index) {
            case 0: {
                $wuxToast().show({
                    type: 'text',
                    duration: 2000,
                    color: '#ff0000',
                    text: "未完成的功能..."
                });
                break;
            }
            case 1: {
                wx.makePhoneCall({
                    phoneNumber: this.data.product.posterPhoneNumber
                });
                break;
            }
            default:
                break;
        }
    },
    showGallery2(e) {
        const {
            current
        } = e.currentTarget.dataset;
        const urls = this.data.imageUrls;

        $wuxGallery().show({
            current,
            urls: urls.map(n => ({
                image: n,
                remark: n
            })),
            indicatorDots: true,
            indicatorColor: '#fff',
            indicatorActiveColor: '#04BE02',
            icon: 'https://wux.cdn.cloverstd.com/logo.png',
            [`delete`]: (current, urls) => {
                console.log('onIconClick')
                return true
            },
        })
    }

})
