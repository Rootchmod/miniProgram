import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';

const app = getApp();

Page({
    data: {
        portFee: 0,
        displayPortFee: "请选择",
        portOptions: [{
            title: '21.5 (日照港)',
            value: "21.5"
        }, {
            title: '16.5 (青岛港)',
            value: "16.5"
        }],
        exchangeRate: 0,
        priceDollar: 0,
        discount: 0,
        priceRmb: 0
    },
    onSelectConfirm(e) {
        console.log("onSelectConfirm", e.detail)
        this.setData({
            portFee: parseFloat(e.detail.value),
            displayPortFee: e.detail.label,
        }, this.calculatePrice);
    },
    async onReady() {
        const res = await app.request()
            .get(`${config.requestUrl}thirdPartyApi/GetExchangeRate`)
            .query()
            .end();

        this.setData({
            exchangeRate: res.data
        });
    },
    calculatePrice() {
        const {
            priceDollar,
            exchangeRate,
            portFee,
            discount
        } = this.data;
        if (priceDollar && exchangeRate && portFee) {
            const priceRmb = (priceDollar * exchangeRate * (1.0 - discount / 100.0) + portFee) * 1.13;
            this.setData({
                priceRmb: priceRmb.toFixed(4)
            });
        }
    },
    onBlurPriceDollar(e) {
        console.log('onBlurPriceDollar', e);
        this.setData({
            priceDollar: parseFloat(e.detail.value)
        }, this.calculatePrice);

    },
    onBlurExchangeRate(e) {
        console.log('onBlurExchangeRate', e);
        this.setData({
            exchangeRate: parseFloat(e.detail.value)
        }, this.calculatePrice);
    },
    onBlurDiscount(e) {
        console.log('onBlurDiscount', e);
        this.setData({
            discount: parseFloat(e.detail.value)
        }, this.calculatePrice);
    }

})
