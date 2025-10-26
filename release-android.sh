#!/bin/bash

# What's for Dinner - Google Play Release Script
# This script helps you prepare and build your app for Google Play Store

echo "🚀 What's for Dinner - Google Play Release Helper"
echo "=================================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null
then
    echo "❌ EAS CLI is not installed"
    echo "📦 Installing EAS CLI globally..."
    npm install -g eas-cli
    echo "✅ EAS CLI installed!"
    echo ""
fi

# Check if logged in to EAS
echo "🔐 Checking Expo account..."
if ! eas whoami &> /dev/null
then
    echo "❌ Not logged in to Expo"
    echo "Please login to your Expo account:"
    eas login
else
    echo "✅ Logged in as: $(eas whoami)"
fi

echo ""
echo "📋 Pre-flight Checklist"
echo "======================="
echo ""
echo "Before building, make sure you have:"
echo "  [ ] Updated the package name in app.json (currently: com.yourname.whatsfordinner)"
echo "  [ ] Created a privacy policy and have the URL ready"
echo "  [ ] Prepared app screenshots (at least 2)"
echo "  [ ] Created a feature graphic (1024x500px)"
echo "  [ ] Registered for Google Play Developer account (\$25)"
echo ""

read -p "Have you completed the checklist above? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Please complete the checklist first!"
    echo "📖 See GOOGLE_PLAY_RELEASE_GUIDE.md for details"
    exit 1
fi

echo ""
echo "🏗️  Building Options"
echo "==================="
echo "1. Production build (for Google Play Store)"
echo "2. Preview build (for internal testing)"
echo "3. Check build status"
echo "4. Exit"
echo ""

read -p "Select an option (1-4): " -n 1 -r option
echo ""

case $option in
    1)
        echo "🏗️  Starting PRODUCTION build..."
        echo "This will take 10-20 minutes."
        echo ""
        eas build --platform android --profile production
        echo ""
        echo "✅ Build complete! Download the .aab file from the link above."
        echo "📤 Next: Upload to Google Play Console or run: eas submit --platform android --latest"
        ;;
    2)
        echo "🏗️  Starting PREVIEW build..."
        echo "This will take 10-20 minutes."
        echo ""
        eas build --platform android --profile preview
        echo ""
        echo "✅ Build complete! Download and install on test devices."
        ;;
    3)
        echo "📊 Checking build status..."
        eas build:list
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📖 For complete instructions, see: GOOGLE_PLAY_RELEASE_GUIDE.md"
echo "🎉 Good luck with your release!"

