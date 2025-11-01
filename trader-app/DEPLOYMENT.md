# TraderPro - Deployment Guide

This guide covers how to build and deploy the TraderPro mobile trading app to the Google Play Store.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Building for Android](#building-for-android)
4. [Play Store Submission](#play-store-submission)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts

1. **Expo Account** (Free)
   - Sign up at: https://expo.dev
   - Used for building the app

2. **Google Play Developer Account** ($25 one-time fee)
   - Register at: https://play.google.com/console
   - Required for publishing to Play Store

### Required Software

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **EAS CLI** (Expo Application Services)
   ```bash
   npm install -g eas-cli
   ```

## Local Testing

### 1. Install Dependencies

```bash
cd trader-app
npm install
```

### 2. Start Development Server

```bash
npm start
```

This will open Expo Dev Tools in your browser.

### 3. Test on Physical Device

**Option A: Expo Go App (Easiest)**
1. Install "Expo Go" from Play Store
2. Scan QR code from terminal/browser
3. App will load on your device

**Option B: Android Emulator**
1. Install Android Studio
2. Set up Android Virtual Device (AVD)
3. Run: `npm run android`

### 4. Test on Web (Optional)

```bash
npm run web
```

Opens the app in your browser for quick testing.

## Building for Android

### Step 1: Login to Expo

```bash
eas login
```

Enter your Expo credentials.

### Step 2: Configure Build

```bash
eas build:configure
```

This creates/updates `eas.json` configuration file.

### Step 3: Build APK (for Testing)

```bash
eas build --platform android --profile preview
```

**What happens:**
- Code is uploaded to Expo servers
- App is built in the cloud
- You receive a download link for APK
- Build time: ~5-15 minutes

**Download and Install:**
1. Click the link in terminal or check https://expo.dev
2. Download APK to your Android device
3. Enable "Install from Unknown Sources"
4. Install and test the APK

### Step 4: Build App Bundle (for Play Store)

```bash
eas build --platform android --profile production
```

**What happens:**
- Builds optimized AAB (Android App Bundle)
- Smaller download size for users
- Required format for Play Store
- Build time: ~5-15 minutes

**Download AAB:**
1. Get download link from terminal
2. Or visit: https://expo.dev/accounts/[your-account]/projects/trader-pro/builds
3. Download the `.aab` file

## Play Store Submission

### Step 1: Prepare Assets

Create the following assets:

1. **App Icon** (512x512 PNG)
   - No transparency
   - 32-bit PNG
   - Represents your app

2. **Feature Graphic** (1024x500 PNG/JPG)
   - Banner for store listing
   - Eye-catching design

3. **Screenshots** (at least 2)
   - Phone screenshots
   - 1080x1920 or 1080x2340
   - Show key features

### Step 2: Create App in Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in details:
   - **App name:** TraderPro
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free

### Step 3: Complete Store Listing

Navigate to "Store presence" > "Main store listing"

**Required Information:**

- **App name:** TraderPro
- **Short description:** (80 characters)
  ```
  Free mobile trading app for stock market enthusiasts. Track, trade, and grow!
  ```

- **Full description:** (See PLAYSTORE_GUIDE.md for full text)

- **App icon:** Upload 512x512 PNG
- **Feature graphic:** Upload 1024x500 image
- **Screenshots:** Upload at least 2 screenshots

- **App category:** Finance
- **Email:** your-email@example.com
- **Privacy policy:** URL to your privacy policy

### Step 4: Complete App Content

Navigate to "Policy" > "App content"

**Privacy Policy:**
- Host PRIVACY_POLICY.md on a public URL
- Or use GitHub Pages
- Enter URL in Play Console

**Content Rating:**
- Complete questionnaire
- Answer honestly
- Likely rating: Everyone

**Target Audience:**
- Select: 18 and older

**Data Safety:**
- Select: "No data collected"
- This app stores data locally only

### Step 5: Upload App Bundle

1. Navigate to "Release" > "Production"
2. Click "Create new release"
3. Upload the AAB file from EAS build
4. Release name: `1.0.0`
5. Release notes:
   ```
   Initial release of TraderPro!
   
   Features:
   - Real-time market data simulation
   - Portfolio management
   - Buy/Sell trading
   - Interactive price charts
   - Watchlist functionality
   - Transaction history
   ```

### Step 6: Review and Publish

1. Review all sections
2. Ensure all required fields are complete
3. Click "Send for review"
4. Wait for approval (1-7 days typically)

## Post-Publication

### Monitor Your App

1. **Reviews & Ratings**
   - Respond to user reviews
   - Address issues promptly

2. **Statistics**
   - Track downloads
   - Monitor user engagement

3. **Crashes & ANRs**
   - Check for crash reports
   - Fix critical issues

### Releasing Updates

When you want to update the app:

1. **Update Version Numbers**

Edit `app.json`:
```json
{
  "expo": {
    "version": "1.1.0",
    "android": {
      "versionCode": 2
    }
  }
}
```

2. **Build New Version**
```bash
eas build --platform android --profile production
```

3. **Upload to Play Console**
- Go to "Release" > "Production"
- Create new release
- Upload new AAB
- Add release notes
- Submit for review

## Troubleshooting

### Build Fails

**Problem:** EAS build fails

**Solutions:**
- Check `app.json` for syntax errors
- Ensure all dependencies are in `package.json`
- Review build logs in Expo dashboard
- Try: `npm install` and rebuild

### App Crashes on Launch

**Problem:** App crashes immediately after opening

**Solutions:**
- Test with `expo start` first
- Check for missing dependencies
- Review error logs in Expo Go
- Ensure all imports are correct

### Play Store Rejection

**Problem:** App rejected by Google

**Solutions:**
- Read rejection reason carefully
- Common issues:
  - Missing privacy policy
  - Incomplete content rating
  - Missing required screenshots
  - Policy violations
- Fix issues and resubmit

### Can't Install APK

**Problem:** APK won't install on device

**Solutions:**
- Enable "Install from Unknown Sources"
- Check device has enough storage
- Ensure Android version is compatible
- Try uninstalling old version first

## Build Profiles Explained

### Preview Profile
```json
"preview": {
  "android": {
    "buildType": "apk"
  }
}
```
- Builds APK file
- For testing on devices
- Larger file size
- Easy to distribute for testing

### Production Profile
```json
"production": {
  "android": {
    "buildType": "app-bundle"
  }
}
```
- Builds AAB file
- For Play Store submission
- Optimized and smaller
- Required by Google Play

## Cost Breakdown

### Free
- Expo account
- EAS builds (limited free tier)
- App development
- App updates

### Paid
- Google Play Developer Account: $25 (one-time)
- EAS builds (if exceeding free tier): ~$29/month
- Optional: Custom domain for privacy policy

## Tips for Success

1. **Test Thoroughly**
   - Test on multiple devices
   - Test all features
   - Check different screen sizes

2. **Quality Assets**
   - Professional app icon
   - Clear screenshots
   - Compelling description

3. **Follow Guidelines**
   - Read Google Play policies
   - Ensure compliance
   - Keep app updated

4. **User Feedback**
   - Respond to reviews
   - Fix reported bugs
   - Add requested features

5. **Marketing**
   - Share on social media
   - Create demo videos
   - Write blog posts

## Additional Resources

- **Expo Documentation:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **Play Console Help:** https://support.google.com/googleplay/android-developer
- **React Native Docs:** https://reactnative.dev

## Support

For help with:
- **Building:** Check Expo documentation and forums
- **Play Store:** Contact Google Play support
- **App Issues:** Review README.md and code comments

## Next Steps

After successful deployment:

1. ✅ Monitor app performance
2. ✅ Collect user feedback
3. ✅ Plan feature updates
4. ✅ Fix bugs promptly
5. ✅ Improve based on reviews
6. ✅ Consider iOS version
7. ✅ Add real market data API (optional)
8. ✅ Implement user authentication (optional)

Good luck with your app! 🚀📱
