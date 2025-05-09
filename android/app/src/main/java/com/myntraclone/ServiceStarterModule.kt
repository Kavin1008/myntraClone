package com.myntraclone

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ServiceStarterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "ServiceStarter"

    @ReactMethod
    fun startService() {
        val context = reactApplicationContext
        val intent = Intent(context, ForegroundService::class.java)
        context.startForegroundService(intent)
    }
}
