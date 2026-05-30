#!/bin/bash
set -e
PROJ=/tmp/colacero-webview
mkdir -p $PROJ/app/src/main/java/com/colacero/app
mkdir -p $PROJ/app/src/main/res/values
mkdir -p $PROJ/app/src/main/res/mipmap-hdpi

cat > $PROJ/app/src/main/AndroidManifest.xml << 'MANIFEST'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="ColaCero"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        <activity
            android:name="com.colacero.app.MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
MANIFEST

cat > $PROJ/app/src/main/java/com/colacero/app/MainActivity.java << 'JAVA'
package com.colacero.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().setStatusBarColor(Color.BLACK);
        getWindow().setNavigationBarColor(Color.BLACK);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAllowFileAccess(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebViewClient(new WebViewClient());
        webView.setBackgroundColor(Color.BLACK);
        webView.loadUrl("https://cola-cero.vercel.app");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
JAVA

cat > $PROJ/app/src/main/res/values/styles.xml << 'STYLE'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#000000</item>
        <item name="android:navigationBarColor">#000000</item>
        <item name="android:windowBackground">@android:color/black</item>
    </style>
</resources>
STYLE

# Generate icon with correct path (use double quotes for variable expansion)
python3 -c "
import zlib, struct
def create_png():
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', 48, 48, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    raw = b''
    for y in range(48):
        raw += b'\x00' + b'\xff\x00\x00' * 48
    compressed = zlib.compress(raw)
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    idat = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    return sig + ihdr + idat + iend
with open('${PROJ}/app/src/main/res/mipmap-hdpi/ic_launcher.png', 'wb') as f:
    f.write(create_png())
print('Icon created at ${PROJ}/app/src/main/res/mipmap-hdpi/ic_launcher.png')
"

cat > $PROJ/build.gradle << 'GRADLE'
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.0'
    }
}
allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
GRADLE

cat > $PROJ/app/build.gradle << 'APPGRADLE'
plugins {
    id 'com.android.application'
}
android {
    namespace 'com.colacero.app'
    compileSdk 34
    defaultConfig {
        applicationId "com.colacero.app"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release { minifyEnabled false }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}
APPGRADLE

printf "rootProject.name = 'ColaCero'\ninclude ':app'\n" > $PROJ/settings.gradle
echo "android.useAndroidX=true" > $PROJ/gradle.properties

cd $PROJ
wget -q https://services.gradle.org/distributions/gradle-8.5-bin.zip -O /tmp/gradle.zip
unzip -qo /tmp/gradle.zip -d /tmp/
export PATH=$PATH:/tmp/gradle-8.5/bin
gradle wrapper --gradle-version 8.5
chmod +x gradlew
./gradlew assembleDebug --no-daemon
ls -lh app/build/outputs/apk/debug/app-debug.apk
file app/build/outputs/apk/debug/app-debug.apk
