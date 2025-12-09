# 🛠 Installation Guide

Since SwiftAuth SDK is currently distributed as a source package, installation involves cloning the repository and linking it locally.

## Prerequisites

Ensure your project environment meets these requirements:
- **Node.js**: v18 or higher
- **React Native**: v0.70+
- **Expo**: SDK 49+ (Recommended)

## Step 1: Clone the Repository

Clone the SDK repository to your local machine:

```bash
git clone https://github.com/allcodez/Auth-SDK_Stage8
```

## Step 2: Build the SDK

Before using the SDK, you must compile the TypeScript source code into JavaScript.

```bash
cd swiftauth-sdk
npm install
npm run build
```

**Note:** If you modify the SDK code later, you must run `npm run build` again to see changes.

## Step 3: Install in Your App

Navigate to your React Native/Expo project directory and install the SDK using the local file path:

```bash
cd your-project-folder
npm install ../path/to/swiftauth-sdk
```

## Step 4: Install Peer Dependencies

SwiftAuth relies on several core libraries that must be installed in your host application:

```bash
npm install firebase @react-native-async-storage/async-storage react-native-safe-area-context
```

## Step 5: Metro Configuration (Crucial)

To allow the Metro bundler to read files outside your project root (since the SDK is in a sibling folder), update your `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../');

const config = getDefaultConfig(projectRoot);

// 1. Watch the SDK folder
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from both project and workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
```

## ⚠️ Troubleshooting "Duplicate React"

If you encounter an "Invalid Hook Call" error, it likely means both the SDK and your App are trying to load their own copies of React.

To fix this:

1. Build the SDK (`npm run build`).
2. Delete the SDK's `node_modules` (`rm -rf node_modules` inside `swiftauth-sdk`).
3. Start your app with cache cleared (`npx expo start -c`).