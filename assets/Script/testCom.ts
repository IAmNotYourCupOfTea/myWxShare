
const { ccclass, property } = cc._decorator;
window['wechatShareByUrlCallBack'] = (errCode) => {
    testCom.getInstance().wechatShareByUrlCallBack(errCode)
}
window['savePictureByUrlCallBack'] = (errCode) => {
    testCom.getInstance().savePictureByUrlCallBack(errCode)
}
window['savePictureByShotSceneCallBack'] = (errCode) => {
    testCom.getInstance().savePictureByShotSceneCallBack(errCode)
}

window['wechatShareByShotSceneCallBack'] = (errCode) => {
    testCom.getInstance().wechatShareByShotSceneCallBack(errCode)
}

@ccclass
export default class testCom extends cc.Component {

    @property(cc.Label) msgInfo: cc.Label = null
    @property(cc.Node) saveNode: cc.Node = null

    @property(cc.Button) savePictureBySSBtn: cc.Button = null
    @property(cc.Button) savePictureByURLBtn: cc.Button = null
    @property(cc.Button) shareFriendBySSBtn: cc.Button = null
    @property(cc.Button) shareFriendByURLBtn: cc.Button = null
    @property(cc.Button) shareTimeLineBySSBtn: cc.Button = null
    @property(cc.Button) shareTimeLineByURLBtn: cc.Button = null


    @property(cc.Node) samallSaveNode: cc.Node = null



    // LIFE-CYCLE CALLBACKS:

    static _instance = null
    static getInstance(): testCom {
        return testCom._instance
    }

    //测试URL
    readonly shareFriendImgUrl = 'https://www.baidu.com/img/xinshouye_7c5789a51e2bfd441c7fe165691b31a1.png'
    readonly shareTimeLineImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557205472551&di=4fc47ed42f862555da0868fa393e9935&imgtype=0&src=http%3A%2F%2Fossweb-img.qq.com%2Fupload%2Fwebplat%2Finfo%2Ft7%2F20150416%2F1429151246442663.png'
    readonly savePicUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557205472551&di=4fc47ed42f862555da0868fa393e9935&imgtype=0&src=http%3A%2F%2Fossweb-img.qq.com%2Fupload%2Fwebplat%2Finfo%2Ft7%2F20150416%2F1429151246442663.png'
    onLoad() {
        testCom._instance = this;
        if (cc.sys.platform == cc.sys.ANDROID) {
            this.msgInfo.string = '安卓系统'
        } else if (cc.sys.platform == cc.sys.IPHONE) {
            this.msgInfo.string = 'IOS系统'
        }

        this.savePictureBySSBtn.node.on('click', () => {
            this.onShotSceneSavePhoto()
        }, this)
        this.savePictureByURLBtn.node.on('click', () => {
            this.onSavePictureByUrl(this.savePicUrl)
        }, this)
        this.shareFriendBySSBtn.node.on('click', () => {
            this.onShotSceneShareFriend()
        }, this)
        this.shareFriendByURLBtn.node.on('click', () => {
            this.onShareFriendByUrl(this.shareFriendImgUrl)
        }, this)
        this.shareTimeLineBySSBtn.node.on('click', () => {
            this.onShotSceneShareTimeLine()
        }, this)
        this.shareTimeLineByURLBtn.node.on('click', () => {
            this.onShareTimeLineByUrl(this.shareTimeLineImgUrl)
        }, this)

        let canvas = cc.director.getScene().getChildByName('Canvas')
        console.log(canvas)
    }

    getRomNameByDate(extName: string) {
        let tp = Math.floor(cc.sys.now())
        let date = new Date(tp)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() + '-';
        let h = date.getHours() + '-';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '-'
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        return 'rom-' + Y + M + D + h + m + s + extName

    }

    shotScenePlus(shotSceneNode: cc.Node, finishCb: (error, shotScenePicPath: string) => void) {
        if (shotSceneNode.getComponent(cc.Mask)) {
            console.warn('截屏节点中不能包含mask')
        }
        if (!cc.sys.isNative) {
            console.warn('仅支持原生平台截图')
            return;
        }
        //cc.RenderTexture
        let saveNodeSize = shotSceneNode.getContentSize()
        let renderTexture = cc.RenderTexture.create(saveNodeSize.width, saveNodeSize.height);

        //屏幕中心点
        let canvas = cc.director.getScene().getChildByName('Canvas')
        console.log(canvas)
        let centerPos = cc.p(0, 0)
        let centerWorldP = canvas.convertToWorldSpaceAR(centerPos)
        let centerNodeP = shotSceneNode.parent.convertToNodeSpaceAR(centerWorldP)
        console.log('屏幕中心点相对于shotSceneNode的父节点的位置', centerNodeP)

        //创建一个size(0,0)且层级高于要截图的节点 的mask
        let maskNode = new cc.Node()
        maskNode.addComponent(cc.Mask)
        maskNode.setContentSize(0, 0)
        maskNode.parent = shotSceneNode.parent
        maskNode.zIndex = 9999
        maskNode.position = centerNodeP
        console.log('创建mask 完成')
        //创建要截图节点的拷贝 截图中节点会移动到左下角 导致截图异常 使用克隆节点进行截图操作
        let cloneShotSceneNode = cc.instantiate(shotSceneNode)
        //将克隆的节点添加到maskNode上 因为mask size(0,0)所以看不到节点移动 
        cloneShotSceneNode.parent = maskNode
        console.log('创建替身截屏节点 完成')
        //延迟一帧 创建mask和克隆节点
        setTimeout(() => {
            //截屏代码
            renderTexture.begin();
            cloneShotSceneNode.position = cc.p(saveNodeSize.width / 2, saveNodeSize.height / 2) // 恢复节点位置  
            cloneShotSceneNode._sgNode.visit();
            renderTexture.end();

            //保存截图
            let picName = this.getRomNameByDate('.png')
            renderTexture.saveToFile(picName, cc.ImageFormat.PNG, true, () => {
                cloneShotSceneNode.destroy() //销毁临时节点
                maskNode.destroy()
                let picPath = jsb.fileUtils.getWritablePath() + picName
                if (jsb.fileUtils.isFileExist(picPath)) {
                    console.log('创建截屏图片成功')
                    //延迟一帧返回 (保存完成在下一帧)
                    setTimeout(() => {
                        finishCb(null, picPath)
                    })
                } else {
                    finishCb('save error', picPath)
                }
            })
        });

    }

    //截屏保存相册
    onShotSceneSavePhoto() {
        this.shotScenePlus(this.samallSaveNode, (err, picPath: string) => {
            if (err) {
                console.error('截屏失败!')
                return
            }

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let java_func_name = 'shotSceneSavePhoto'
                jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare",
                    java_func_name,
                    "(Ljava/lang/String;)V",
                    picPath)
            } else if (cc.sys.os == cc.sys.OS_IOS) { //IOS需求保存相册后自动跳转微信
                jsb.reflection.callStaticMethod(
                    "RootViewController", //类名
                    "shotSceneSavePhotoAndPath:", //方法名
                    picPath //参数
                )
            }
        })
    }
    //截屏分享朋友
    onShotSceneShareFriend() {
        this.shotScenePlus(this.saveNode, (err, picPath: string) => {
            if (err) {
                console.error('截屏失败!')
                return
            }

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let java_func_name = 'shareFriendByShotScence'
                jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare",
                    java_func_name,
                    "(Ljava/lang/String;)V",
                    picPath)
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                //不实现
            }
        })
    }
    //截屏分享朋友圈
    onShotSceneShareTimeLine() {
        this.shotScenePlus(this.samallSaveNode, (err, picPath: string) => {
            if (err) {
                console.error('截屏失败!')
                return
            }

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let java_func_name = 'shareTimeLineByShotScence'
                jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare",
                    java_func_name,
                    "(Ljava/lang/String;)V",
                    picPath)
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                //不实现
            }
        })
    }

    //分享朋友 图片来自网络
    onShareFriendByUrl(url: string) {
        this.msgInfo.string = 'onShareFriend'
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "shareFriendByUrl", "(Ljava/lang/String;)V", url)
        } else if (cc.sys.platform == cc.sys.IPHONE) {
            //IOS 原生方法 IOS9.0及以上微信分享只能分享文字 分享网络链接时显示图片是网站第一张图片
        }
    }

    //分享朋友圈 图片来自网络
    onShareTimeLineByUrl(url: string) {
        this.msgInfo.string = 'onShareTimeLine'
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "shareTimeLineByUrl", "(Ljava/lang/String;)V", url)
        } else if (cc.sys.platform == cc.sys.IPHONE) {

        }
    }

    //保存图片到相册通过Url
    onSavePictureByUrl(url: string) {
        this.msgInfo.string = 'onSavePic'
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare",
                "savePictureByUrl",
                "(Ljava/lang/String;)V",
                url)
        } else if (cc.sys.platform == cc.sys.IPHONE) { //保存图片到相册跳转微信
            //RootViewController  +(void) checkPhotoPermissonAndSavePic:(NSString*) imgUrl
            jsb.reflection.callStaticMethod(
                "RootViewController", //类名
                "checkPhotoPermissonAndSavePic:", //方法名
                url//参数
            )
        } else {
            //非手机平台暂不处理
        }
    }


    /*************************** 平台处理回调 ***************************** */
    //分享成功回调
    wechatShareByUrlCallBack(errCode: eWxShareErrCode) {
        let msg = ''
        switch (errCode) {
            case eWxShareErrCode.success:
                msg = '微信分享成功'
                break;
            case eWxShareErrCode.notInstallWX:
                msg = '用户没有安装微信'
                break;
            case eWxShareErrCode.getImageError:
                msg = '获取网络图片失败'
                break;
            default:
                msg = '未知错误'
                break;

        }
        this.msgInfo.string = msg
    }

    //保存图片回调
    savePictureByUrlCallBack(errCode: eSavePictureErrCode) {
        let msg = ''
        switch (errCode) {
            case eSavePictureErrCode.success:
                msg = '保存相册成功'
                break;
            case eSavePictureErrCode.noPermisson:
                msg = '没有访问相册权限,图片保存失败'
                break;
            case eSavePictureErrCode.getImageError:
                msg = '获取网络图片失败'
                break;
            case eSavePictureErrCode.notInstallWX:
                msg = '没有安装微信'
                break;
            case eSavePictureErrCode.saveShotSceneError:
                msg = '截屏保存本地失败'
                break;
            default:
                msg = '未知错误'
                break;
        }
        this.msgInfo.string = msg
    }


    //截屏保存相册回调
    savePictureByShotSceneCallBack(errCode: eShotScene2PhotoErrCode) {
        let msg = ''
        switch (errCode) {
            case eShotScene2PhotoErrCode.success:
                msg = '截屏图片保存相册成功'
                break;
            case eShotScene2PhotoErrCode.shotSceneSaveError:
                msg = '截屏图片保存失败'
                break;
            default:
                msg = '未知错误'
                break;
        }
        this.msgInfo.string = msg
    }



    //截屏分享到微信
    wechatShareByShotSceneCallBack(errCode: eWxShareByShotSceneErrCode) {
        let msg = ''
        switch (errCode) {
            case eWxShareByShotSceneErrCode.success:
                msg = '截屏分享成功'
                break;
            case eWxShareByShotSceneErrCode.notInstallWX:
                msg = '没有安装微信'
                break;
            case eWxShareByShotSceneErrCode.shotSceneSaveError:
                msg = '截屏图片保存失败'
                break;
            default:
                msg = '未知错误'
                break;
        }
        this.msgInfo.string = msg
    }
    // update (dt) {}
}
/*************************** 平台处理错误码 ****************************** */
//分享网络图片
enum eWxShareErrCode {
    success = 0, //成功
    notInstallWX, //没有安装微信
    getImageError, //获取分享图片失败(传Url时)
}
//保存网络图片到相册
enum eSavePictureErrCode {
    success = 0, //成功
    notInstallWX, //没有安装微信
    getImageError, //获取分享图片失败(传Url时)
    noPermisson,//没有权限 (IOS系统才有)
    saveShotSceneError = 4,//截屏保存本地失败
}
//分享截图
enum eWxShareByShotSceneErrCode {
    success = 0, //成功
    notInstallWX, //没有安装微信
    shotSceneSaveError = 2, //截屏图片保存失败
}

//保存截屏图片到相册
enum eShotScene2PhotoErrCode {
    success = 0,
    shotSceneSaveError = 1,//截屏图片保存失败
}
