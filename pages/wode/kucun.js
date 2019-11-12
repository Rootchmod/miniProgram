import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();

Page({
    data: {
        pageIndex: 1,

        portList: [],

        typeList: [],

        uploadUrl: `${config.requestUrl}upload`,
        imageHost: "",

        products: []
    },
    onAction(e) {
        console.log('onAction', e.detail)
        if (e.detail.action.type === "primary") {
            this.saveProduct(e.detail.action.productId);
        } else {
            this.deleteProduct(e.detail.action.productId);
        }

    },

    onNavClick(e) {
        console.log('onClick', e)
        wx.navigateTo({
            "url": "/pages/wode/kucunfabu"
        });
    },
    onQuantityBlur(e) {
        console.log('onQuantityBlur', e)
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].quantity"]: parseFloat(e.detail.value)
        });
    },
    onPriceBlur(e) {
        console.log('onPriceBlur', e)
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].price"]: parseFloat(e.detail.value)
        });
    },
    onSellerBlur(e) {
        console.log('onSellerBlur', e);
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].seller"]: e.detail.value
        });
    },
    onShipNameBlur(e) {
        console.log('onShipNameBlur', e)
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].shipName"]: e.detail.value
        });
    },
    onChemicalPropertiesBlur(e) {
        console.log('onChemicalPropertiesBlur', e)
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].chemicalProperties"]: e.detail.value
        });
    },
    onRemarkBlur(e) {
        console.log('onRemarkBlur', e)
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].remark"]: e.detail.value
        });
    },

    onChange(e) {
        console.log('onChange', e)
        const {
            file
        } = e.detail
        if (file.status === 'uploading') {
            wx.showLoading()
        } else if (file.status === 'done') {
            console.log("onchange done")
        } else if (file.status === 'remove') {
            console.log("onchange Remove");
            const productIndex = e.currentTarget.dataset.productIndex;

            this.setData({
                ["products[" + productIndex + "].imageList"]: this.data.products[productIndex].imageList.filter(p => file.res ? (p.url !== this.data.imageHost + file.res.data) : (p.url !== file.url))
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
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].imageList"]: this.data.products[productIndex].imageList.concat({
                url: this.data.imageHost + e.detail.data
            })
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

    onTypeValueChange(e) {
        console.log("onTypeValueChange", e);
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].type"]: this.data.typeList[parseInt(e.detail.value)].value
        });
    },
    onPortValueChange(e) {
        console.log("onPortValueChange", e);
        const productIndex = e.currentTarget.dataset.productIndex;
        this.setData({
            ["products[" + productIndex + "].port"]: this.data.portList[parseInt(e.detail.value)].value
        });
    },

    onReady() {
        this.setData({
            pageIndex: 1
        }, () => this.getMyInventoryList(true));
    },

    async getMyInventoryList(refresh) {
        const page = this;
        var userid = wx.getStorageSync('user_Id')
        try {
            const res = await app.request()
                .get(`${config.requestUrl}inventory/getMyInventoryList`)
                .query({
                    rows: 10,
                    page: page.data.pageIndex,
                    userId: userid
                }).end();
            console.log("getMyInventoryList", res);
            if (res.statusCode === 200 && res.data) {
                wx.stopPullDownRefresh();
                page.setData({
                    portList: res.data.portList,
                    typeList: res.data.typeList,
                    imageHost: res.data.imageHost
                }, () => {
                    page.setData({
                        products: refresh ? res.data.products : page.data.products.concat(res.data.products),
                        pageIndex: page.data.pageIndex + 1
                    });
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
        this.getMyInventoryList();
    },

    onPullDownRefresh() {
        this.setData({
            pageIndex: 1
        }, () => this.getMyInventoryList(true))
    },

    async saveProduct(productId) {
        const page = this;
        try {
            let product = this.data.products.find(p => p.id === productId);
            product.imageList = product.imageList.map(p => p.url);
            const res = await app.request()
                .post(`${config.requestUrl}inventory/saveProduct`)
                .query({
                    ...product,
                    userId: app.globalData.userId,
                    imageHost: page.data.imageHost
                }).end();
            console.log("saveProduct", res);
            if (res.statusCode === 200 && res.data) {
                wx.stopPullDownRefresh();
                $wuxToast().show({
                    type: 'text',
                    duration: 1500,
                    color: '#ff0000',
                    text: "保存成功!"
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

    async deleteProduct(productId) {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}inventory/deleteProduct`)
                .query({
                    productId,
                    userId: app.globalData.userId
                }).end();
            console.log("deleteProduct", res);
            if (res.statusCode === 200 && res.data) {
                wx.stopPullDownRefresh();
                $wuxToast().show({
                    type: 'text',
                    duration: 1500,
                    color: '#ff0000',
                    text: "删除成功!"
                });
                const products = page.data.products.filter(p => p.id !== productId);
                page.setData({
                    products
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
