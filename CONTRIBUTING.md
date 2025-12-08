# Contributing to SwiftAuth SDK 🤝


## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)


---

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (Mac only) or **Android Studio** (for Android emulator)

### Initial Setup
```bash
# 1. Clone the repository
git clone https://github.com/allcodez/Auth-SDK_Stage8
cd Auth-SDK_Stage8

# 2. Install SDK dependencies
cd swiftauth-sdk
npm install

# 3. Install example app dependencies
cd ../swiftauth-example
npm install

# 4. Link SDK to example app
cd ../swiftauth-sdk
npm link
cd ../swiftauth-example
npm link swiftauth-sdk

# 5. Create your working branch
git checkout -b feature/your-name-task
```

---

## 🗂️ Project Structure
```
swiftauth-sdk/
├── swiftauth-sdk/           # Main SDK package
│   ├── src/
│   │   ├── components/      # React Native UI components
│   │   ├── services/        # Authentication services
│   │   ├── hooks/           # React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   ├── errors/          # Custom error classes
│   │   ├── utils/           # Utility functions
│   │   ├── styles/           # Utility functions
│   │   └── index.ts         # Main export file
│   └── package.json
├── swiftauth-example/       # Example/demo app
│   ├── App.tsx
│   └── package.json
├── docs/                    # Documentation
└── .github/                 # GitHub templates
```