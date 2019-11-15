import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();

Page({
    data: {
        items: [{
                type: 'radio',
                label: '品名',
                value: 'name',
                children: [{
                    label: '全部',
                    value: ''
                }],
                groups: ["0", "1", "2", "3"],
            },
            {
                type: 'sort',
                label: '发布时间',
                value: "date",
                groups: ["1"]
            },
            {
                type: 'sort',
                label: '价格(元/湿吨)',
                value: "price",
                groups: ["2"]
            },
            {
                type: 'sort',
                label: '数量(万吨)',
                value: "quantity",
                groups: ["3"]
            }
        ],
        value: "",
        array: [],
        pageIndex: 1,
        keyword: "",
        productName: "",
        sortColumn: "F_CreateDate",
        sortOrder: "DESC"
    },
    onLoad(options) {
        this.setData({
            keyword: options.keyword
        });
        console.log(options);
    },
    onReady() {
        this.getProductNames();
        this.getKucunList();
    },
    async getProductNames() {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}inventory/getProductNames`)
                .query()
                .end();
            console.log("getProductNames", res);
            if (res.statusCode === 200 && res.data) {
                const labels = [{
                    label: '全部',
                    value: ''
                }].concat(res.data.map(currentValue => {
                    return {
                        label: currentValue,
                        value: currentValue
                    }
                }));

                page.setData({
                    ["items[0].children"]: labels
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
    async getKucunList() {
        const page = this;
        try {
            const res = await app.request()
                .get(`${config.requestUrl}inventory/getListByKeyword`)
                .query({
                    productName: page.data.productName,
                    keyword: page.data.keyword,
                    rows: 10,
                    page: page.data.pageIndex,
                    sortColumn: page.data.sortColumn,
                    sortOrder: page.data.sortOrder
                })
                .end();
            console.log("getKucunList", res);
            if (res.statusCode === 200 && res.data) {
                page.setData({
                    array: page.data.array.concat(res.data),
                    pageIndex: page.data.pageIndex + 1
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
        this.getKucunList();
    },

    async onChange(e) {
        console.log("onChange e:", e);

        const items = e.detail.checkedValues;

        // 品名筛选
        this.setData({
            productName: items[0]
        });

        const page = this;

        // 排序
        const sortItemIndex = items.findIndex(p => p === 1 || p === -1);
        if (sortItemIndex >= 0) {
            const sortItem = items[sortItemIndex];
            console.log("sortItemIndex", sortItemIndex);

            switch (sortItemIndex) {
                case 1: {
                    if (sortItem === 1) {
                        page.setData({
                            sortColumn: "F_CreateDate",
                            sortOrder: "ASC"
                        });
                    } else {
                        page.setData({
                            sortColumn: "F_CreateDate",
                            sortOrder: "DESC"
                        });
                    }
                    break;
                }
                case 2: {
                    if (sortItem === 1) {
                        page.setData({
                            sortColumn: "Price",
                            sortOrder: "ASC"
                        });
                    } else {
                        page.setData({
                            sortColumn: "Price",
                            sortOrder: "DESC"
                        });
                    }
                    break;
                }
                case 3: {
                    if (sortItem === 1) {
                        page.setData({
                            sortColumn: "Quantity",
                            sortOrder: "ASC"
                        });
                    } else {
                        page.setData({
                            sortColumn: "Quantity",
                            sortOrder: "DESC"
                        });
                    }
                    break;
                }
            }
        }

        try {
            const res = await app.request()
                .get(`${config.requestUrl}inventory/getListByKeyword`)
                .query({
                    productName: page.data.productName,
                    keyword: page.data.keyword,
                    rows: 10,
                    page: 1,
                    sortColumn: page.data.sortColumn,
                    sortOrder: page.data.sortOrder
                })
                .end();
            console.log("筛选onChange", res);
            if (res.statusCode === 200 && res.data) {
                page.setData({
                    array: res.data,
                    pageIndex: 2
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
    onOpen(e) {
        this.setData({
            opened: true
        })
    },
    onClose(e) {
        this.setData({
            opened: false
        })
    },
    /**
     * 阻止触摸移动
     */
    noop() {},




    /* ↓ 搜索框事件 ↓ */
    onInputChange(e) {
        console.log('onChange', e)
        this.setData({
            value: e.detail.value,
        });
    },
    onConfirm(e) {
        console.log('onConfirm', e);
        // 查询
        wx.redirectTo({
            url: `/pages/chaxunangangkou/anguanjianzi?keyword=${e.detail.value}`
        });
    },
    onClear(e) {
        console.log('onClear', e)
        this.setData({
            value: '',
        });
    },
    /* ↑ 搜索框事件 ↑ */

    navigateToDetail(e) {
        console.log(e);
        wx.navigateTo({
            url: `/pages/chaxunangangkou/chaxunxiangqing?id=${e.currentTarget.dataset.productId}`
        });
    }

})
