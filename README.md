# Android IOS原生方法 微信分享
一个在CocosCreator v1.9.3版本下的项目实现Android,IOS实现网络图片和截图分享原生方法分享微信
因为是原生方法,并没有使用微信的api,所以有些限制:
Android平台下不能在分享图片和文字时,只显示图片并不会显示分享时预先设置的文字.
IOS平台下在IOS9.0以前的版本可以正常分享.在以后的版本中当分享图片时微信显示不支持该格式.而且不能直接跳转微信,只能调转到系统自带的分享栏需要用户自己选择分享,分享一个链接的时候,微信分享会自动给出一张图片,这张图片是链接页面的第一张图片,也就是没得选.

由于上述限制的原因项目中Android平台下只实现
1.网络图片保存相册,分享微信,分享朋友圈
2.游戏截图保存相册,分享微信,分享朋友圈

IOS平台下
1.网络图片保存相册保存完成跳转微信
2.游戏截图保存相册保存完成跳转微信

# js工程 
使用cc.RenderTexture截取场景中某个节点,通常会用到的问题
1.截取某个节点时,截图的时候节点移动到了屏幕的左下角
2.截取完成把图片恢复原位了,但是会看到图片移动,有闪屏的感觉
3.截到的图片时黑屏或者白屏
在该方法中都可以避免 注释写的很清楚了
shotScenePlus(shotSceneNode: cc.Node, finishCb: (error, shotScenePicPath: string) => void)


# Android工程 
Android平台下使用截屏分享微信的时候,在传入Cocos项目的可写路径的时,会导致分享时微信获取资源失败,需要把图片移到sd卡路径下,再进行分享操作

# IOS工程 
需要导入 <Photos/PHPhotoLibrary.h> 模块(IOS自带的模块)
在获取相册权限的时候用到
还需要编辑Info.plist文件添加一下提示语

<key>NSPhotoLibraryUsageDescription</key>
    <string>请允许App访问您的相册</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>请允许App保存图片到相册</string>
    <key>NSCameraUsageDescription</key>
    <string>请允许App访问您的相机</string>

如果像要在应用中跳转微信,需要把微信添加到应用白名单中 修改Info.plist

<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>wechat</string>
      <string>weixin</string>
    </array>
