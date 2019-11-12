App({
    globalData: {
        userInfo: null,//用户信息
        userId: "",
        companyId:""
    } ,

    /**
     * [request description]
     * @param  {[type]} method [description]
     * @param  {[type]} url    [description]
     * @param  {[type]} data   [description]
     * @param  {[type]} header [description]
     * @return {[type]}        [description]
     */
    request(method, url, data, header) {
        if (typeof method === 'object') {
            url = method.url;
            data = method.data;
            header = method.header;
            method = method.method;
        }
        var req = {
                method: method,
                url: url,
                header: {},
                data: {}
            },
            def = {
                header: function (name, value) {
                    if (value) req.header[name] = value;
                    else req.header = name;
                    return def;
                },
                query: function (name, value) {
                    if (value) req.data[name] = value;
                    else req.data = name;
                    return def;
                },
                send: function (name, value) {
                    if (value) req.data[name] = value;
                    else req.data = name;
                    return def;
                },
                use: function (middleware) {
                    req = middleware.call(def, req);
                    return def;
                },
                end: function (callback, done) {
                    var p = new Promise(function (accept, reject) {
                        if (!callback) {
                            wx.showNavigationBarLoading();
                            callback = function (err, res) {
                                wx.hideNavigationBarLoading();
                                if (err) return reject(err);
                                else accept(res);
                            };
                        }
                    });
                    if (!req.header['content-type']) {
                        req.header['content-type'] = req.method == 'get' ?
                            'application/x-www-form-urlencoded' : 'application/json';
                    }
                    req.complete = done;
                    req.fail = callback;
                    req.success = callback.bind(req, null);
                    wx.request(req);
                    return p;
                }
            };
        'get post put delete'.split(' ').forEach(function (method) {
            def[method] = (function () {
                return function (url) {
                    req.url = req.url || url;
                    req.method = req.method || method;
                    return def;
                };
            })();
        });
        return def;
    },

    formatDate(d) {
        return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) +
            " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    },

    onLaunch: function () {
        if (wx.cloud) {
            wx.cloud.init({
                traceUser: true
            })
        }
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            }
        })
    },
    globalData: {
        ColorList: [{
                title: '嫣红',
                name: 'red',
                color: '#e54d42'
            },
            {
                title: '桔橙',
                name: 'orange',
                color: '#f37b1d'
            },
            {
                title: '明黄',
                name: 'yellow',
                color: '#fbbd08'
            },
            {
                title: '橄榄',
                name: 'olive',
                color: '#8dc63f'
            },
            {
                title: '森绿',
                name: 'green',
                color: '#39b54a'
            },
            {
                title: '天青',
                name: 'cyan',
                color: '#1cbbb4'
            },
            {
                title: '海蓝',
                name: 'blue',
                color: '#0081ff'
            },
            {
                title: '姹紫',
                name: 'purple',
                color: '#6739b6'
            },
            {
                title: '木槿',
                name: 'mauve',
                color: '#9c26b0'
            },
            {
                title: '桃粉',
                name: 'pink',
                color: '#e03997'
            },
            {
                title: '棕褐',
                name: 'brown',
                color: '#a5673f'
            },
            {
                title: '玄灰',
                name: 'grey',
                color: '#8799a3'
            },
            {
                title: '草灰',
                name: 'gray',
                color: '#aaaaaa'
            },
            {
                title: '墨黑',
                name: 'black',
                color: '#333333'
            },
            {
                title: '雅白',
                name: 'white',
                color: '#ffffff'
            },
        ]
    }

})
