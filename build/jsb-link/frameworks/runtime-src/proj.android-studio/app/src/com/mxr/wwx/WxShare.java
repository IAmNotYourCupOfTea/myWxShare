package com.mxr.wwx;

import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.io.File;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by Administrator on 2019/5/6.
 */

public class WxShare extends AppActivity{

    /*检查是否安装微信*/
     static boolean isInstallWeChart(){
        PackageInfo packageInfo = null;
        try {
            packageInfo = WxShare.getContext().getPackageManager().getPackageInfo("com.tencent.mm", 0);
        } catch (Exception e) {
            packageInfo = null;
            e.printStackTrace();
        }
        if (packageInfo == null) {
            return false;
        } else {
            return true;
        }
    }

    //从网络图片url获取图片file
    static  File getImgFileByUrl(final String url){
        File imgFile = null;
        URL imageUrl = null;
        try {
            imageUrl = new URL(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        try {
            HttpURLConnection conn = (HttpURLConnection)imageUrl.openConnection();
            conn.setDoInput(true);
            conn.connect();
            InputStream is = conn.getInputStream();
            byte[] buf = MyTools.input2byte(is);
            String cachePath =   getContext().getExternalCacheDir().getPath();
            String imgName = cachePath +File.separator+ MyTools.getUuid() + ".png"; //下载图片保存路径
            imgFile =  MyTools.writeBytesToFile(buf,imgName);
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        Log.i("wxShare", "获取图片path:"+imgFile.getPath());
        return imgFile;
    }

    //分享朋友
    /*
    ErrorCode:
    0.成功
    1.没有安装微信
    2.获取图片失败
    */
    public  static void shareFriendByUrl(String url){
        Log.i("wxShare", "分享朋友参数 :"+url );
        int errorCode = 0;
       // String url = "https://www.baidu.com/img/xinshouye_7c5789a51e2bfd441c7fe165691b31a1.png";
        if (!isInstallWeChart()){
            Log.e("'wxShare'", "没有安装微信 " );
            errorCode=  1;
            wxShareByUrlFinishCb(errorCode);
            return;
        }
        File file = getImgFileByUrl(url);
        if (file==null){
            errorCode=  2;
            Log.e("wxShare", "图片获取失败 " );
            wxShareByUrlFinishCb(errorCode);
            return;
        }
        Intent intent = new Intent();
        ComponentName componentName = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareImgUI");
        intent.setComponent(componentName);
        intent.setAction(Intent.ACTION_SEND);
        intent.setType("image/*"); //text/plain  //image/*
        intent.putExtra(Intent.EXTRA_TEXT, "测试微信朋友分享Demo..."); //TODO:分享图片是只能看到图片 不能显示文字
        intent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(file));
        WxShare.getContext().startActivity(intent);
        Log.i("'wxShare'", "微信朋友分享成功 " );
        wxShareByUrlFinishCb(errorCode);
    }

    //分享朋友圈 通过url
    public static  void shareTimeLineByUrl(String url){
        Log.i("wxShare", "分享朋友圈参数 :"+url );
        int errorCode = 0;
        if (!isInstallWeChart()){
            Log.e("'wxShare'", "没有安装微信 " );
            errorCode=  1;
            wxShareByUrlFinishCb(errorCode);
            return;
        }
        File file = getImgFileByUrl(url);
        if (file==null){
            errorCode=  2;
            wxShareByUrlFinishCb(errorCode);
            Log.e("wxShare", "图片获取失败 " );
            return;
        }else{
            long size =  file.length() / 1024;
            Log.i("要分享图片的大小 kb:",Float.toString(size));
        }
        Intent intent = new Intent();
        ComponentName componentName = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareToTimeLineUI");
        intent.setComponent(componentName);
        intent.setAction(Intent.ACTION_SEND);
        intent.setType("image/*"); //text/plain  //image/*
        intent.putExtra(Intent.EXTRA_TEXT, "测试微信朋友分享Demo...");
        intent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(file));
        WxShare.getContext().startActivity(intent);
        Log.i("wxShare", "微信朋友圈分享成功 " );
        wxShareByUrlFinishCb(errorCode);
    }

    //保存图片通过url
    public  static  void savePictureByUrl(String url){
        Log.i("savePicture", "保存图片到相册 参数:"+url );
        int errorCode = 0;
        File file = getImgFileByUrl(url);
        if (file==null){
            errorCode=  2; //网络获取图片失败
            Log.e("savePicture", "图片获取失败 " );
            savePictureByUrlFinishCb(errorCode);
            return;
        }else{
            long size =  file.length() / 1024;
            Log.i("要分享图片的大小 kb:",Float.toString(size));
        }
        String picName = MyTools.getUuid() + ".png";
        Bitmap bmp = MyTools.file2Bitmap(file);
        //更新相册
        MediaStore.Images.Media.insertImage(getContext().getContentResolver(),
                bmp, picName, null);
        Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        Uri uri = Uri.fromFile(file);
        intent.setData(uri);
        getContext().sendBroadcast(intent);
        savePictureByUrlFinishCb(errorCode);
    }



    //截屏图片保存在相册
    static  void  shotSceneSavePhoto(String picPath){
        Log.i("shotSceneSavePhoto", "截屏图片保存在相册 参数:"+picPath );
      //  String picPath = MyTools.getSDCardPath() + File.separator + picPath;
        File picFile = new File(picPath);
        if (!picFile.exists()){
            Log.e("shotScenceSavePhoto", "截屏图片不存在" );
            shotSceneSavePhotoFinishCb(1);
            return;
        }
        String picName = MyTools.getUuid() + ".png";
        Bitmap bmp = MyTools.file2Bitmap(picFile);
        //更新相册
        MediaStore.Images.Media.insertImage(getContext().getContentResolver(),
                bmp, picName, null);
        Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        Uri uri = Uri.fromFile(picFile);
        intent.setData(uri);
        getContext().sendBroadcast(intent);
        shotSceneSavePhotoFinishCb(0);
    }

    //分享微信好友图片使用截屏图片
    static void  shareFriendByShotScence(String picPath){
        Log.i("shotSceneSavePhoto", "分享微信好友图片使用截屏图片 参数:"+picPath );
        if (!isInstallWeChart()){
            Log.e("'wxShare'", "没有安装微信 " );
            wxShareByShotSceneFinishCb(1);
            return;
        }
        File picFile = new File(picPath);
//        boolean canRead =  picFile.canRead();
//        boolean canWrite = picFile.canWrite();
//        Log.i("截屏文件权限 是否可读:",Boolean.toString(canRead));
//        Log.i("截屏文件权限 是否可写:",Boolean.toString(canWrite));
        File handledPicFile = null;
        if (!picFile.exists()){
            Log.e("shotScenceSavePhoto", "截屏图片不存在" );
            wxShareByShotSceneFinishCb(2);
            return;
        }else{
            //在可写目录下不能分享 移动文件到SD卡再进行操作
            String endPath = MyTools.getSDCardPath() + File.separator + "shotScene.png";
            File shotSceneFile = new File(endPath);
            if (shotSceneFile.exists()){
              boolean isSuccess =  shotSceneFile.delete();
              //  Log.i( "删除文件删除是否成功: ",Boolean.toString(isSuccess));
            }
            handledPicFile = new File(endPath);
           try {
               MyTools.copyFile(picFile,handledPicFile);
           }catch (IOException e){
               Log.e("拷贝文件失败!",e.toString());
               wxShareByShotSceneFinishCb(2);
               return;
           }
           picFile.delete();

//            long size =  handledPicFile.length() / 1024;
//            boolean isExite = handledPicFile.exists();
//            Log.i("移动后文件是否存在",Boolean.toString(isExite));
//            Log.i("移动后文件路径:",handledPicFile.getPath());
//            Log.i("要分享图片的大小 kb:",Float.toString(size));
        }

        Intent intent = new Intent();
        ComponentName componentName = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareImgUI");
        intent.setComponent(componentName);
        intent.setAction(Intent.ACTION_SEND);
        intent.setType("image/*"); //text/plain  //image/*
        intent.putExtra(Intent.EXTRA_TEXT, "截图分享..."); //TODO:分享图片是只能看到图片 不能显示文字
        intent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(handledPicFile));
        WxShare.getContext().startActivity(intent);
        Log.i("'wxShare'", "微信朋友分享成功 " );
        wxShareByShotSceneFinishCb(0);
    }

    //分享微信朋友圈 图片使用截屏图片
    static void  shareTimeLineByShotScence(String picPath){
        Log.i("shotSceneSavePhoto", "分享微信朋友圈 参数:"+picPath );
        if (!isInstallWeChart()){
            Log.e("'wxShare'", "没有安装微信 " );
            wxShareByShotSceneFinishCb(1);
            return;
        }
        File picFile = new File(picPath);
//        boolean canRead =  picFile.canRead();
//        boolean canWrite = picFile.canWrite();
//        Log.i("截屏文件权限 是否可读:",Boolean.toString(canRead));
//        Log.i("截屏文件权限 是否可写:",Boolean.toString(canWrite));
        File handledPicFile = null;
        if (!picFile.exists()){
            Log.e("shotScenceSavePhoto", "截屏图片不存在" );
            wxShareByShotSceneFinishCb(2);
            return;
        }else {
            //在可写目录下不能分享 移动文件到SD卡再进行操作 renameTo 方法有问题 使用先拷贝再删除
            String endPath = MyTools.getSDCardPath() + File.separator + "shotScene.png";
            File shotSceneFile = new File(endPath);
            if (shotSceneFile.exists()) {
                boolean isSuccess = shotSceneFile.delete();
                Log.i("删除文件删除是否成功: ", Boolean.toString(isSuccess));
            }
            handledPicFile = new File(endPath);
            try {
                MyTools.copyFile(picFile, handledPicFile);
            } catch (IOException e) {
                Log.e("拷贝文件失败!", e.toString());
                wxShareByShotSceneFinishCb(2);
                return;
            }
            picFile.delete();
        }
        Intent intent = new Intent();
        ComponentName componentName = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareToTimeLineUI");
        intent.setComponent(componentName);
        intent.setAction(Intent.ACTION_SEND);
        intent.setType("image/*"); //text/plain  //image/*
        intent.putExtra(Intent.EXTRA_TEXT, "测试微信朋友分享Demo...");
        intent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(handledPicFile));
        WxShare.getContext().startActivity(intent);
        Log.i("wxShare", "微信朋友圈分享成功 " );
        wxShareByShotSceneFinishCb(0);
    }

    //截屏图片保存在相册 回调js

    /*
    //保存截屏图片到相册
    enum eShotScene2PhotoErrCode {
        success = 0,
        shotSceneSaveError = 1,//截屏图片保存在sd卡失败
    }
    * */
    static void shotSceneSavePhotoFinishCb(final int errCode){
        ((Cocos2dxActivity)Cocos2dxActivity.getContext()).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("savePictureByShotSceneCallBack && savePictureByShotSceneCallBack(" + errCode+ ")");
                Log.i("shotSceneSavePhoto", "jsb回调code:" +errCode);
            }
        });
    }
    /*
    //分享截图
    enum eWxShareByShotSceneErrCode {
        success = 0, //成功
        shotSceneSaveError = 2, //截屏图片保存失败
    }
    * */
    static void wxShareByShotSceneFinishCb(final int errCode){
        ((Cocos2dxActivity)Cocos2dxActivity.getContext()).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("wechatShareByShotSceneCallBack && wechatShareByShotSceneCallBack(" + errCode+ ")");
                Log.i("shareFriendByShotScence", "jsb回调code:" +errCode);
            }
        });
    }

    /*
    //分享网络图片
    enum eWxShareErrCode {
        success = 0, //成功
        notInstallWX, //没有安装微信
        getImageError, //获取分享图片失败
    }
    * */
    static void wxShareByUrlFinishCb(final int errCode){
        ((Cocos2dxActivity)Cocos2dxActivity.getContext()).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("wechatShareByUrlCallBack && wechatShareByUrlCallBack(" + errCode+ ")");
                Log.i("wxShare", "jsb回调code:" +errCode);
            }
        });
    }


    /*
    保存网络图片到相册
    enum eSavePictureErrCode {
        success = 0, //成功
        getImageError = 2, //获取分享图片失败
     }
    * */
    static void savePictureByUrlFinishCb(final int errCode){
        ((Cocos2dxActivity)Cocos2dxActivity.getContext()).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("savePictureByUrlCallBack && savePictureByUrlCallBack(" + errCode+ ")");
                Log.i("savePicture", "jsb回调code:" +errCode);
            }
        });
    }

}


