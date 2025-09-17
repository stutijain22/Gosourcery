This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Open Terminal

> > Open terminal and move to a folder where you want to keep your project

## Step 2 : Clone the From Git

> > Clone the latest project from git by using this below command in the terminal

# Using

git clone https://github.com/stutijain22/Gosourcery.git

## Step 3:\*\* Open Project Terminal >

> > > > Once the project successfully cloned, To install node_modules run following command in the terminal with the same directory.

# Using

yarn install

## For IOS

## Step 4:\*\* After Yarn Install >

> > You need to install the pod for ios. Follow below command to install pod in the ios project.

# Using

cd ios && pod install && cd ..

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

## Step 5: Start Metro

> > You will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 6: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 7: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

## Build

### Android

## Create Android APK and App Bundle same steps

> > Set this on the android studio
> > Click Build >> Generate Signed App Bundle/ APK >> Select APK >> Click Next
> > APP_UPLOAD_STORE_FILE=gosourcery.keystore
> > APP_UPLOAD_KEY_ALIAS=gosourcery
> > APP_UPLOAD_STORE_PASSWORD=android
> > APP_UPLOAD_KEY_PASSWORD=android

> > For Create APK

## Using This command (Run in the project terminal)

cd android && ./gradlew clean && ./gradlew :app:assembleRelease && cd ..

## Output

android/app/build/outputs/apk/release/app-release.aab

> > For Create APP Bundle

## Using Android Studio

Open Android Studio >> Click Build >> Generate Signed App Bundle/ APK >> Select Android App Bundle >> Click Next >> Select Release >> Click Create

## Output

android/app/release/app-release.aab

### IOS

> > Open the Project in Xcode

## Using (Run in the project terminal)

cd ios
open Gosourcery.xcworkspace

## Step 1:

> > In Xcode, Select the Product Option >> Select Archive

## Step 2: After archiving:

> > Automatically Open Organizer window.
> > Choose:

1. Distribute App → App Store Connect → Upload directly.
2. Distribute App → Select Test Flight → Upload directly.(If you need to upload for a test purpose)
   > > Go to Apple account >> Click Our App >> Select Test Flight >> Show a Manage option on the Latest uploaded build >> Click Manage >> Selecte last Option None of the algorithms mentioned above

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
