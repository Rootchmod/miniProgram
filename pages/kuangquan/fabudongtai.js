import regeneratorRuntime from '../../dist/runtime';
import config from '../../config';
import {
    $wuxToast
} from '../../dist/index'

const app = getApp();

Page({
    data: {
        uploadUrl: `${config.requestUrl}upload`,
        fileList: [],
        uploadImageList: [],
        valueText: ""
    },

    async onRightClick(e) {
        if ((!this.data.valueText) && (!this.data.uploadImageList)) {
            console.warn("no text , no images")
            return;
        }
        console.log('onClick', e)
        if (e.detail.type === 'right') {
            const page = this;
            try {
                const res = await app.request()
                    .post(`${config.requestUrl}moments/postMoments`)
                    .query({
                        valueText: page.data.valueText,
                        uploadImageList: page.data.uploadImageList,
                        userId: wx.getStorageSync("user_Id")
                    }).end();
                console.log("postMoments", res);
                if (res.statusCode === 200 && res.data) {
                    wx.showToast({
                        title: '发布成功!',
                        icon: 'success',
                        duration: 1000,
                        success() {
                            setTimeout(() => {
                                wx.switchTab({
                                    url: '/pages/kuangquan/index'
                                });
                            }, 1000);
                        }
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
    },
    onTextChange(e) {
        this.setData({
            valueText: e.detail.value
        });
    },

    onChange(e) {
        console.log('onChange', e)
        const {
            file
        } = e.detail
        if (file.status === 'uploading') {
            this.setData({
                progress: 0
            })
            wx.showLoading()
        } else if (file.status === 'done') {
            console.log("onchange done")
        } else if (file.status === 'remove') {
            console.log("onchange Remove");
            this.setData({
                uploadImageList: this.data.uploadImageList.filter(p => p !== e.detail.file.res.data)
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
        //let uploadImageList = page.data.uploadImageList;
        // uploadImageList = uploadImageList.concat({
        //     uid: uploadImageList.length,
        //     url: `${config.resourceUrl}${e.detail.data}`
        // });

        this.setData({
            uploadImageList: this.data.uploadImageList.concat(e.detail.data)
        });
    },
    onProgress(e) {
        console.log('onProgress', e)
        this.setData({
            progress: e.detail.file.progress,
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
    }

    // ,
    // onRemove(e) {
    //     const {
    //         file,
    //         fileList
    //     } = e.detail
    //     wx.showModal({
    //         content: '确定删除？',
    //         success: (res) => {
    //             if (res.confirm) {
    //                 this.setData({
    //                     fileList: fileList.filter((n) => n.uid !== file.uid),
    //                 });
    //             }
    //         },
    //     })

    // }

})
