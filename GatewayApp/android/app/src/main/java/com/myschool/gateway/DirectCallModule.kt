package com.myschool.gateway

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import androidx.core.content.ContextCompat

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DirectCallModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "DirectCallModule"
  }

  @ReactMethod
  fun placeCall(phoneNumber: String, promise: Promise) {
    try {
      if (phoneNumber.isBlank()) {
        promise.reject("E_PHONE_NUMBER_EMPTY", "Phone number is empty")
        return
      }

      val ctx = reactApplicationContext

      // Ensure CALL_PHONE permission is granted.
      val hasCallPermission = ContextCompat.checkSelfPermission(
        ctx,
        Manifest.permission.CALL_PHONE
      ) == PackageManager.PERMISSION_GRANTED

      if (!hasCallPermission) {
        promise.reject("E_PERMISSION_MISSING", "CALL_PHONE permission not granted")
        return
      }

      val callUri = Uri.parse("tel:" + phoneNumber)
      val intent = Intent(Intent.ACTION_CALL)
      intent.data = callUri
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

      ctx.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("E_CALL_FAILED", e.message, e)
    }
  }
}

