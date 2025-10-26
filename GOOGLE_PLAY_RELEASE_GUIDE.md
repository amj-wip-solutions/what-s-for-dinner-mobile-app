# Google Play Store Release Guide

## Prerequisites Checklist

Before you can publish to Google Play, you need:

- [ ] Google Play Developer Account ($25 one-time fee)
- [ ] Expo account (free - sign up at expo.dev)
- [ ] EAS CLI installed globally
- [ ] App icon and splash screen ready
- [ ] Privacy Policy URL (required by Google Play)
- [ ] App screenshots (at least 2, recommended 4-8)
- [ ] Feature graphic (1024x500px)
- [ ] App description and promotional text

---

## Step 1: Install EAS CLI and Login

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Or with yarn
yarn global add eas-cli

# Login to your Expo account
eas login

# Verify you're logged in
eas whoami
```

---

## Step 2: Configure Your App for Production

Your `app.json` needs a proper package name and version info. Update these fields:

```json
{
  "android": {
    "package": "com.yourcompany.whatsfordinner",  // Change this to your actual domain
    "versionCode": 1,  // Auto-increments with each build
    "permissions": []   // Only include permissions you actually need
  }
}
```

**Important:** Choose your package name carefully - it cannot be changed once published!

---

## Step 3: Build Your Production APK/AAB

Google Play requires an **Android App Bundle (.aab)** file, not an APK.

```bash
# Navigate to your mobile-app directory
cd /Users/alex_mj/workspace/amj-wip-solutions/whats-for-dinner/mobile-app

# Build for production (creates .aab file)
eas build --platform android --profile production

# This will:
# 1. Ask if you want to generate a new Android keystore (say YES for first build)
# 2. Upload your code to Expo's servers
# 3. Build your app in the cloud
# 4. Provide a download link when complete
```

**First Build Notes:**
- EAS will generate and store your Android keystore securely
- This process takes 10-20 minutes
- You'll get a link to download the .aab file when complete

---

## Step 4: Create Google Play Console Account

1. Go to https://play.google.com/console
2. Pay the $25 one-time registration fee
3. Complete your developer profile
4. Accept the Developer Distribution Agreement

---

## Step 5: Create Your App in Play Console

1. Click **"Create app"** in Play Console
2. Fill in:
   - **App name:** What's for Dinner
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Complete the declarations (privacy policy, etc.)

---

## Step 6: Complete Store Listing

### Required Content:

**App Details:**
- **Short description** (80 characters max)
  - "Plan your weekly meals with smart recipe assignments and day rules"

- **Full description** (4000 characters max)
  - Explain features: meal planning, recipe management, day rules, etc.

**Graphics:**
- **App icon:** 512x512px (you have this already)
- **Feature graphic:** 1024x500px (create this)
- **Phone screenshots:** At least 2 (recommended 4-8)
  - Take screenshots of: meal plan, recipe list, auth screen, settings
  - Size: 16:9 or 9:16 ratio

**Categorization:**
- **App category:** Food & Drink
- **Tags:** meal planning, recipes, dinner, cooking

**Contact Details:**
- Email address (for users to contact you)
- Privacy Policy URL (REQUIRED - see Step 7)

---

## Step 7: Privacy Policy (REQUIRED)

You MUST have a privacy policy URL. Since you're using Supabase (collects email), you need one.

**Quick Options:**
1. Use a privacy policy generator:
   - https://www.privacypolicies.com/
   - https://app-privacy-policy-generator.firebaseapp.com/

2. Host it on:
   - GitHub Pages (free)
   - Your own website
   - Privacy policy hosting services

**What to include:**
- What data you collect (email, recipes, meal plans)
- How you use it (authentication, app functionality)
- That you use Supabase for data storage
- User rights (data deletion, export)

---

## Step 8: Content Rating

1. Go to **Content rating** in Play Console
2. Complete the questionnaire
3. Your app will likely be rated "Everyone"

---

## Step 9: Set Up App Pricing & Distribution

1. Select **countries** where app will be available
2. Confirm it's **Free**
3. Select **All countries** (or specific ones)
4. Complete any required compliance forms

---

## Step 10: Upload Your App Bundle

1. Go to **Production** → **Create new release**
2. Upload the **.aab file** you downloaded from EAS
3. Add **Release notes** (what's new in this version)
4. Review and roll out

**First Release Notes Example:**
```
🎉 Initial release of What's for Dinner!

Features:
• Smart meal planning for 7 or 14 days
• Recipe management with tags
• Day-based rules for automatic recipe assignments
• Easy recipe swapping
• Dark mode support
```

---

## Step 11: Submit for Review

1. Complete all required sections (you'll see checkmarks when done)
2. Click **"Review release"**
3. Click **"Start rollout to Production"**
4. Wait for Google's review (typically 1-3 days)

---

## Alternative: EAS Submit (Automated)

Instead of manually uploading, you can use EAS Submit:

```bash
# After building, submit directly to Google Play
eas submit --platform android --latest

# You'll need to provide:
# - Google Play service account key (JSON file)
# - Follow the prompts
```

**To set up auto-submit:**
1. Create a Google Service Account
2. Download the JSON key
3. Grant it access in Play Console
4. Use `eas submit` command

**Guide:** https://docs.expo.dev/submit/android/

---

## Future Updates

When you want to release updates:

```bash
# 1. Update version in app.json
# "version": "1.1.0"

# 2. Build new version
eas build --platform android --profile production

# 3. Submit to Play Console
# Either manually upload or use:
eas submit --platform android --latest

# The versionCode auto-increments with "autoIncrement": true in eas.json
```

---

## Testing Before Production

**Internal Testing Track:**
```bash
# Build a preview version
eas build --platform android --profile preview

# Upload to Internal Testing in Play Console
# Add test users via email
# They can test before public release
```

---

## Common Issues & Solutions

### Issue: Build fails
- Check that all dependencies are compatible
- Ensure app.json is valid JSON
- Review build logs in Expo dashboard

### Issue: Missing permissions
- Add required permissions to `app.json`:
```json
"android": {
  "permissions": [
    "INTERNET",
    "ACCESS_NETWORK_STATE"
  ]
}
```

### Issue: Icon/Splash not showing
- Ensure icon is 1024x1024px (or higher)
- Ensure adaptive-icon.png exists
- Rebuild after changing assets

### Issue: App rejected by Google
- Most common: Missing privacy policy
- Ensure you're compliant with their policies
- Address feedback and resubmit

---

## Quick Command Reference

```bash
# Login to EAS
eas login

# Build for production
eas build --platform android --profile production

# Check build status
eas build:list

# Submit to Play Store (after setup)
eas submit --platform android --latest

# Update credentials
eas credentials
```

---

## Resources

- **Expo EAS Docs:** https://docs.expo.dev/eas/
- **Google Play Console:** https://play.google.com/console
- **EAS Build Guide:** https://docs.expo.dev/build/introduction/
- **EAS Submit Guide:** https://docs.expo.dev/submit/introduction/
- **Android App Bundle:** https://developer.android.com/guide/app-bundle

---

## Cost Summary

- **Google Play Developer Account:** $25 (one-time)
- **Expo EAS Build:** Free tier includes limited builds/month, paid plans available
- **Hosting (for privacy policy):** Free (GitHub Pages) or minimal cost

---

## Next Steps

1. ✅ Install EAS CLI: `npm install -g eas-cli`
2. ✅ Update app.json with your package name
3. ✅ Create a privacy policy
4. ✅ Run your first production build
5. ✅ Register for Google Play Console
6. ✅ Complete store listing
7. ✅ Submit for review!

Good luck with your release! 🚀

