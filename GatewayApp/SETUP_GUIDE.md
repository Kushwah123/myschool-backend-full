# React Native Expo Gateway - Deployment Guide

Complete setup guide for deploying the React Native Expo Gateway app.

---

## 📋 Quick Checklist

- [ ] Install Node.js 16+
- [ ] Install Expo CLI
- [ ] Clone/download project
- [ ] Run `npm install`
- [ ] Configure backend URL
- [ ] Test with Expo Go
- [ ] Build production APK
- [ ] Deploy to devices

---

## 🔧 Environment Setup

### 1. Install Node.js
Download from: https://nodejs.org (LTS version recommended)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Expo CLI
```bash
npm install -g expo-cli
```

Verify installation:
```bash
expo --version
```

### 3. Create Expo Account (Optional but Recommended)
```bash
expo signup
# or
expo login
```

---

## 🏗️ Project Setup

### 1. Clone/Download Project
```bash
cd GatewayApp
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- React Native
- Expo framework
- Socket.IO client
- Zustand (state management)
- AsyncStorage (persistence)
- Navigation libraries

### 3. Verify Installation
```bash
npm start
```

Should show:
```
Expo DevTools is running at ...
Use Android app to scan the QR code above.
```

---

## 📱 Testing with Expo Go

### Option 1: Android Device

1. **Install Expo Go App**
   - Open Google Play Store
   - Search "Expo Go"
   - Install app

2. **Run Development Server**
   ```bash
   npm start
   ```

3. **Scan QR Code**
   - Open Expo Go app
   - Tap "Scan"
   - Scan the QR code shown in terminal

4. **App Loads**
   - Wait for app to bundle
   - Configure gateway settings
   - Test functionality

### Option 2: Android Emulator

```bash
npm start
# Press 'a' for Android Emulator
```

---

## ⚙️ Configuration

### Via UI (Easiest)

1. Open app
2. Fill in settings:
   - **Backend URL:** `http://192.168.1.100:5000`
   - **Device ID:** `SCHOOL-GATEWAY-01`
   - **Device Name:** `Reception Phone`
   - **SIM Number:** `+919876543210`
3. Click "Save Settings"
4. Click "Start Gateway Service"

### Environment Variables (Optional)

Create `.env` file in project root:
```
EXPO_PUBLIC_DEFAULT_BACKEND=http://192.168.1.100:5000
EXPO_PUBLIC_DEVICE_ID=SCHOOL-GATEWAY-01
```

---

## 🔐 Permissions Testing

### Grant Permissions

1. Open app
2. Allow permissions when prompted:
   - Contacts
   - Phone
   - Internet
3. Verify "Connected" status appears

### Manual Permission Grant

Android Settings:
```
Settings > Apps > School Gateway > Permissions
- Enable "Contacts"
- Enable "Phone"
```

---

## 🧪 Functionality Testing

### Test 1: Backend Connection
```bash
# In terminal where npm start is running, look for:
[SocketService] Connecting to: http://192.168.1.100:5000
[SocketService] Connected to backend
[SocketService] Gateway registered: SCHOOL-GATEWAY-01
```

### Test 2: Permission Requests
1. Verify permission prompts appear
2. Grant each permission
3. Confirm "Connected & Ready" status

### Test 3: Call Handling
1. Initiate call from teacher dashboard
2. Check app receives call request
3. Verify SIM call is initiated
4. Confirm call status is sent back

---

## 📦 Building Production APK

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build release
eas build --platform android --profile release

# Output: app-*.apk file
```

### Local Build

```bash
# Requires Android SDK setup
expo prebuild --clean

./android/gradlew -p android assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## 📲 Installation on Devices

### From APK File

```bash
# Connect device via USB
adb install app-release.apk

# Verify installation
adb shell pm list packages | grep gateway
```

### From Play Store

1. Upload APK to Google Play Console
2. Submit for review
3. Share link with users
4. Users install from Play Store

---

## 🔄 Development Workflow

### Make Changes

1. Edit source files in `src/`
2. Save file
3. App auto-reloads on device

### Common Changes

**Change Backend URL:**
- Edit in app UI
- Or modify `app.json` defaults

**Modify Call Handling:**
- Edit `src/services/callService.ts`
- Save and reload

**Update UI:**
- Edit `src/screens/HomeScreen.tsx`
- Save and reload

---

## 🐛 Debugging

### View Logs

```bash
# In terminal where npm start is running
# Logs appear automatically

# Or use React Native debugger
npm start
# Press 'j' for React Native Debugger
```

### Common Issues

**App Won't Connect to Backend**
- Verify backend URL in settings
- Check firewall allows port 5000
- Test URL in browser: `http://IP:5000`

**Permissions Not Granted**
- Check Android Settings > Apps > Permissions
- Manually enable permissions
- Restart app

**Service Stops in Background**
- Disable battery optimization for app
- Enable "Auto-start Service" in settings
- Check device doesn't have aggressive power saving

---

## 📊 Monitoring

### Check Connection Status

```bash
# In app: Status should show "Connected & Ready"

# In console logs:
# [SocketService] Heartbeat sent
# [SocketService] Call status sent: ...
```

### Performance Monitoring

```bash
# Android Studio > Device Monitor
# Or use built-in profiling in Expo CLI
```

---

## 🚀 Production Deployment

### Pre-Production Checklist

- [ ] Test on multiple devices
- [ ] Verify all permissions work
- [ ] Test actual SIM calls
- [ ] Check background reconnection
- [ ] Verify call status reporting
- [ ] Monitor logs for 24 hours
- [ ] Test multi-device setup
- [ ] Document setup procedure

### Production Build

```bash
# Update version in app.json
{
  "expo": {
    "version": "1.0.1"
  }
}

# Build release
eas build --platform android --profile release

# Test on staging
adb install app-*.apk

# Deploy to production
# Upload to Play Store or distribute APK
```

---

## 📈 Multi-Device Deployment

### Setup Multiple Devices

**Device 1:**
```
Device ID: SCHOOL-GATEWAY-01
SIM: +919876543210
```

**Device 2:**
```
Device ID: SCHOOL-GATEWAY-02
SIM: +919876543211
```

### Automated Deployment

```bash
# Create deployment script
#!/bin/bash
for device in 192.168.1.101 192.168.1.102 192.168.1.103
do
  adb -s $device install app-release.apk
done
```

---

## 🔒 Security Configuration

### For Production

1. **Use HTTPS**
   ```
   Backend URL: https://production.school.com:5000
   ```

2. **Enable API Authentication**
   - Add token to registration

3. **SSL Certificates**
   - Install certificates on device
   - Verify backend certificate

---

## 📞 Support & Troubleshooting

### Get Logs

```bash
# Device logs
adb logcat > logs.txt

# Expo logs
npm start > logs.txt 2>&1
```

### Contact Support

Provide:
- Device logs
- Backend logs
- Steps to reproduce issue
- Device OS version

---

## 🎓 Next Steps

1. ✅ Setup environment
2. ✅ Install dependencies
3. ✅ Test with Expo Go
4. ✅ Configure settings
5. ✅ Build release APK
6. ✅ Deploy to devices
7. ✅ Monitor production

---

**Last Updated:** 2026-06-06  
**Version:** 1.0.0
