Page({
    data: {
        name: "淡水河谷公司",
        phoneNumber: "13370851680",
        description: "秉承将矿产资源转化为财富及可持续发展动力的使命，淡水河谷是一家总部设在巴西的全球性矿业公司。 我们是全球领先的铁矿石生产商和第二大镍生产商。",
        category: "生产商",
        address: "北京市朝阳区建国门外大街1号国贸写字楼2座1816",
        products: [{
            name: "矿石C",
            price: 100,
            quantity: 100,
            date: "2019-02-01",
            port: "青岛港",
            seller: "公司ABC",
            shipName: "船名ABC"
        }, {
            name: "矿石A",
            price: 800,
            quantity: 100,
            date: "2019-02-01",
            port: "青岛港",
            seller: "公司ABC",
            shipName: "船名ABC"
        }, {
            name: "矿石B",
            price: 1100,
            quantity: 100,
            date: "2019-02-01",
            port: "青岛港",
            seller: "公司ABC",
            shipName: "船名ABC"
        }]
    },
    makePhoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.phoneNumber
        });
    }
})
