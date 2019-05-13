/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
 Copyright (c) 2013-2017 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "RootViewController.h"
#import "cocos2d.h"
#import "platform/ios/CCEAGLView-ios.h"
#import <Photos/PHPhotoLibrary.h> //访问相册权限
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h" //oc调js

@implementation RootViewController

/*
// The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
// Custom initialization
}
return self;
}
*/

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Initialize the CCEAGLView
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [UIScreen mainScreen].bounds
                                         pixelFormat: (__bridge NSString *)cocos2d::GLViewImpl::_pixelFormat
                                         depthFormat: cocos2d::GLViewImpl::_depthFormat
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: NO
                                     numberOfSamples: 0 ];

    // Enable or disable multiple touches
    [eaglView setMultipleTouchEnabled:YES];

    // Set EAGLView as view of RootViewController
    self.view = eaglView;
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}


// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];

    auto glview = cocos2d::Director::getInstance()->getOpenGLView();

    if (glview)
    {
        CCEAGLView *eaglview = (__bridge CCEAGLView *)glview->getEAGLView();

        if (eaglview)
        {
            CGSize s = CGSizeMake([eaglview getWidth], [eaglview getHeight]);
            cocos2d::Application::getInstance()->applicationScreenSizeChanged((int) s.width, (int) s.height);
        }
    }
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

#pragma mark -- 检测访问相册权限  有权限就保存
+(void) checkPhotoPermissonAndSavePic:(NSString*) imgUrl{
    //NSString *appTempPath = NSTemporaryDirectory();
    
    //----第一次不会进来
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    if (status == PHAuthorizationStatusRestricted || status == PHAuthorizationStatusDenied){
        // 无权限 做一个友好的提示
        UIAlertView * alart = [[UIAlertView alloc]initWithTitle:@"温馨提示" message:@"请您设置允许该应用访问您的相机\n设置>隐私>相机" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
        [alart show];
        NSLog(@"用户已经设置了相册不可访问,温馨提示");
        [self finishCbAndErrCode:3];
        return;
    }
    //----每次都会走进来
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
        if (status == PHAuthorizationStatusAuthorized) {
            NSLog(@"用户批准权限");
            [self savePictureAndImgUrl:imgUrl];
        }else{
            NSLog(@"Denied or Restricted");
            [self finishCbAndErrCode:3];
            //----为什么没有在这个里面进行权限判断，因为会项目会蹦。。。
        }
    }];
}


#pragma mark -- <保存到相册>
+ (void) savePictureAndImgUrl:(NSString *)imgUrl{
    
    NSError *error=nil;
    NSURL *url=[NSURL URLWithString:imgUrl];
    NSURLRequest *request=[[NSURLRequest alloc] initWithURL:url];
    NSData *imgData=[NSURLConnection sendSynchronousRequest:request returningResponse:nil error:&error];
    UIImage *img=nil;
    if(imgData)
    {
        NSLog(@"获取网络图片成功!");
        img=[UIImage imageWithData:imgData];
        //参数1:图片对象
        //参数2:成功方法绑定的target
        //参数3:成功后调用方法
        //参数4:需要传递信息(成功后调用方法的参数)
        UIImageWriteToSavedPhotosAlbum(img,
                                       self,
                                       @selector(image:finishedSavingWithError:contextInfo:),
                                       nil);
    }else{
        NSLog(@"获取网络图片失败!");
        [self finishCbAndErrCode:2];
    }
}


#pragma mark -- 保存相册完成代理方法 (一定要有实现)
+(void)image:(UIImage *)image finishedSavingWithError:(NSError *)error contextInfo:(void *)contextInfo {
    NSString *msg = nil;
    if(error){
        msg = @"保存图片失败";
    }else{
        msg = @"保存图片成功 打开微信";
        [self openWechat];
    }
    NSLog(@"保存图片结果:%@",msg);
}
#pragma 打开微信
+ (void) openWechat{
    /**
     *  需要在info里面添加 LSApplicationQueriesSchemes字段
     */
    NSURL *url = [NSURL URLWithString:@"weixin://"];
    if([[UIApplication sharedApplication] canOpenURL:url]){
        [[UIApplication sharedApplication] openURL:url];
        [self finishCbAndErrCode:0];
    } else {
        UIAlertView*ale=[[UIAlertView alloc] initWithTitle:@"提示" message:@"您没有安装手机微信,请安装手机微信后重试." delegate:nil cancelButtonTitle:nil otherButtonTitles:@"确定", nil];
        [ale show];
        [self finishCbAndErrCode:1];
    }
    
}
/*
 enum eSavePictureErrCode {
 success = 0, //成功
 notInstallWX, //没有安装微信
 getImageError , //获取分享图片失败
 noPermisson ,//没有权限 (IOS系统才有)
 }
 */
#pragma oc调js
+(void) finishCbAndErrCode:(int) errCode{
    //window['savePicCallBack'](errcode)
    NSString * js_str = [NSString stringWithFormat:@"window['savePicCallBack'] && window['savePicCallBack'](%d)",errCode];
    const char* c_script = js_str.UTF8String;
    se::ScriptEngine::getInstance()->evalString(c_script);
}
/*
 enum eSavePictureErrCode {
     success = 0, //成功
     notInstallWX, //没有安装微信
     getImageError , //获取分享图片失败
     noPermisson ,//没有权限 (IOS系统才有)
     saveShotSceneError = 4,//截屏保存本地失败
 }
 */
#pragma 截屏保存相册 跳微信
+(void) shotSceneSavePhotoAndPath:(NSString*) picPath{
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if (![fileManager fileExistsAtPath:picPath]) {
        NSLog(@"截屏保存本地出错!");
        [self finishCbAndErrCode:4];
        return;
    }else{
        //权限判断
        //----第一次不会进来
        PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
        if (status == PHAuthorizationStatusRestricted || status == PHAuthorizationStatusDenied){
            // 无权限 做一个友好的提示
            UIAlertView * alart = [[UIAlertView alloc]initWithTitle:@"温馨提示" message:@"请您设置允许该应用访问您的相机\n设置>隐私>相机" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
            [alart show];
            NSLog(@"用户已经设置了相册不可访问,温馨提示");
            [self finishCbAndErrCode:3];
            return;
        }
        //----每次都会走进来
        [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
            if (status == PHAuthorizationStatusAuthorized) {
                NSLog(@"用户批准权限");
                //保存图片到相册
                UIImage *img= [UIImage imageWithContentsOfFile:picPath];
                UIImageWriteToSavedPhotosAlbum(img,
                                            self,
                                            @selector(image:finishedSavingWithError:contextInfo:),
                                            nil);
            }else{
                NSLog(@"Denied or Restricted");
                [self finishCbAndErrCode:3];
                //----为什么没有在这个里面进行权限判断，因为会项目会蹦。。。
            }
        }];
    }
}


@end
