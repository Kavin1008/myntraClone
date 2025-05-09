package com.myntraclone

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class ForegroundService : Service() {

    // The notification channel ID
    private val CHANNEL_ID = "myntraclone_channel"

    override fun onCreate() {
        super.onCreate()

        // Create the notification channel (only needed for Android 8.0+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Myntra Clone Service",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Create the notification for the foreground service
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("MyntraClone Service")
            .setContentText("Running in the background")
            .setSmallIcon(R.mipmap.ic_launcher) // Ensure this icon exists in your drawable folder
            .build()

        // Start the service in the foreground
        startForeground(1, notification)

        // Perform background task here (using a background thread or coroutine)
        startBackgroundTask()

        return START_STICKY
    }

    // Method to run a background task in a coroutine
    private fun startBackgroundTask() {
        GlobalScope.launch(Dispatchers.IO) {
            // Perform your background work here (like network operations, file I/O, etc.)
            // For example, a simulated background task
            Thread.sleep(5000) // Simulate work
            // After background task is completed
            stopSelf() // Stop the service once the task is done
        }
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
