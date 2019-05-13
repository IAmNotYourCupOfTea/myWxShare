package com.mxr.wwx;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

/**
 * Created by Administrator on 2019/5/6.
 */

public class MyTools {
    //获取uuid
    public static   String getUuid(){
        String uuid = UUID.randomUUID().toString().replace("-","");
        return  uuid;
    }

    //流转字节
    public static final byte[] input2byte(InputStream inStream)
            throws IOException {
        ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
        byte[] buff = new byte[100];
        int rc = 0;
        while ((rc = inStream.read(buff, 0, 100)) > 0) {
            swapStream.write(buff, 0, rc);
        }
        byte[] in2b = swapStream.toByteArray();
        return in2b;
    }

    //写文件
    public static File writeBytesToFile(byte[] b, String outputFile) {
        File file = null;
        FileOutputStream os = null;

        try {
            file = new File(outputFile);
            os = new FileOutputStream(file);
            os.write(b);
        } catch (Exception var13) {
            var13.printStackTrace();
        } finally {
            try {
                if(os != null) {
                    os.close();
                }
            } catch (IOException var12) {
                var12.printStackTrace();
            }

        }

        return file;
    }

    //系统相册目录
   public static String getCameraPath(){
       String galleryPath= Environment.getExternalStorageDirectory()
               + File.separator + Environment.DIRECTORY_DCIM
               +File.separator+"Camera"+File.separator;
       return  galleryPath;
   }

   //文件转图片Bitmap
    public static Bitmap file2Bitmap( File file){
        Bitmap b = BitmapFactory.decodeFile(file.getPath());
        return  b;
    }

    //获取sd卡路径
    public static String getSDCardPath(){
        File sdDir = null;
        boolean sdCardExist = Environment.getExternalStorageState()
                .equals(android.os.Environment.MEDIA_MOUNTED);//判断sd卡是否存在
        if(sdCardExist)
        {
            sdDir = Environment.getExternalStorageDirectory();//获取跟目录
        }
        return sdDir.toString();
    }

    // 复制文件
    public static void copyFile(File sourceFile,File targetFile)
            throws IOException{
        // 新建文件输入流并对它进行缓冲
        FileInputStream input = new FileInputStream(sourceFile);
        BufferedInputStream inBuff=new BufferedInputStream(input);

        // 新建文件输出流并对它进行缓冲
        FileOutputStream output = new FileOutputStream(targetFile);
        BufferedOutputStream outBuff=new BufferedOutputStream(output);

        // 缓冲数组
        byte[] b = new byte[1024 * 5];
        int len;
        while ((len =inBuff.read(b)) != -1) {
            outBuff.write(b, 0, len);
        }
        // 刷新此缓冲的输出流
        outBuff.flush();

        //关闭流
        inBuff.close();
        outBuff.close();
        output.close();
        input.close();
    }

    // 复制文件夹
    public static void copyDirectiory(String sourceDir, String targetDir)
            throws IOException {
        // 新建目标目录
        (new File(targetDir)).mkdirs();
        // 获取源文件夹当前下的文件或目录
        File[] file = (new File(sourceDir)).listFiles();
        for (int i = 0; i < file.length; i++) {
            if (file[i].isFile()) {
                // 源文件
                File sourceFile=file[i];
                // 目标文件
                File targetFile=new
                        File(new File(targetDir).getAbsolutePath()
                        +File.separator+file[i].getName());
                copyFile(sourceFile,targetFile);
            }
            if (file[i].isDirectory()) {
                // 准备复制的源文件夹
                String dir1=sourceDir + "/" + file[i].getName();
                // 准备复制的目标文件夹
                String dir2=targetDir + "/"+ file[i].getName();
                copyDirectiory(dir1, dir2);
            }
        }
    }

}
