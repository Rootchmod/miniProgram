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
            ],
            name: "",
            poster: "",
            price: 0,
            quantity: 0,
            date: "",
            port: "",
            chemicalProperties: "",
            remark: "",
            seller: "",
            shipName: "",
            posterId: "",
            posterPhoneNumber: ""
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
