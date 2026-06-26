# Android Gateway Setup (School SIM Calling)

This backend expects one or more Android gateway devices to connect through Socket.IO and place calls using the school's SIM card.

## 1) Gateway Socket Events

### Device -> Backend
- `gateway:register`
  - payload: `{ deviceId, deviceName, simNumber }`
- `gateway:heartbeat`
  - payload: `{}`
- `gateway:call-status`
  - payload: `{ callId, status }`
  - status: `calling | connected | busy | failed | completed`

### Backend -> Device
- `gateway:place-call`
  - payload: `{ callId, parentNumber, teacherName, studentName, simNumber }`

## 2) Required Android Permissions

Add these permissions in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CALL_PHONE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

Also request runtime permissions for `CALL_PHONE` and `READ_PHONE_STATE`.

## 3) Kotlin Socket.IO Client Notes

Use `io.socket:socket.io-client` and connect to backend:

```kotlin
socket.emit(
  "gateway:register",
  JSONObject()
    .put("deviceId", "SCHOOL-GATEWAY-01")
    .put("deviceName", "Reception Phone")
    .put("simNumber", "+91XXXXXXXXXX")
)
```

Listen for call request:

```kotlin
socket.on("gateway:place-call") { args ->
  val payload = args[0] as JSONObject
  val callId = payload.getString("callId")
  val parentNumber = payload.getString("parentNumber")
  // Place call using Telecom API / ACTION_CALL
}
```

Update call state:

```kotlin
socket.emit(
  "gateway:call-status",
  JSONObject().put("callId", callId).put("status", "connected")
)
```

## 4) Foreground Service Recommendation

Run socket logic in a foreground service so the gateway stays connected:
- Auto reconnect on network changes
- Send heartbeat every 20-30 seconds
- Track call state transitions and emit updates

## 5) Security Recommendation

For production, secure gateway registration with:
- device secret key per phone
- IP allowlist / VPN
- signed payload timestamps

