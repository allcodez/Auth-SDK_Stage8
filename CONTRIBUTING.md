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
├── swiftauth-sdk/              # Main SDK package
│   ├── src/
│   │   ├── core/               # RENAMED from services
│   │   │   ├── AuthProvider.tsx      # Main provider component
│   │   │   ├── AuthContext.tsx       # React context
│   │   │   ├── stateManager.ts       # State tracking
│   │   │   ├── tokenManager.ts       # Token management
│   │   │   └── index.ts
│   │   │
│   │   ├── providers/          # RENAMED/SPLIT from services
│   │   │   ├── EmailProvider.ts      # Email/password
│   │   │   ├── GoogleProvider.ts     # Google OAuth
│   │   │   ├── AppleProvider.ts      # Apple sign-in
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/              # React hooks
│   │   │   ├── useAuth.ts            # Main auth hook
│   │   │   ├── useAuthState.ts       # State hook
│   │   │   └── index.ts
│   │   │
│   │   ├── components/         # Pre-built UI
│   │   │   ├── AuthScreen.tsx        # Complete auth screen
│   │   │   ├── LoginForm.tsx         # Email login form
│   │   │   ├── SignUpForm.tsx        # Email signup form
│   │   │   ├── SocialButtons.tsx     # Google/Apple buttons
│   │   │   └── index.ts
│   │   │
│   │   ├── types/              # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── config.types.ts       # Configuration types
│   │   │   ├── error.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── errors/             # Custom errors
│   │   │   ├── AuthError.ts
│   │   │   ├── errorTypes.ts         # All custom exceptions
│   │   │   ├── errorMapper.ts        # Firebase → custom
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/              # Utilities
│   │   │   ├── validation.ts
│   │   │   ├── logger.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/             # Styles (if any)
│   │   │   └── theme.ts
│   │   │
│   │   └── index.ts            # Main export
│   │
│   ├── dist/                   # Compiled output
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── swiftauth-example/          # Example app
│   ├── app/                    # ADDED - Expo Router
│   │   ├── (tabs)/
│   │   │   ├── index.tsx
│   │   │   └── profile.tsx
│   │   ├── auth/
│   │   │   ├── prebuilt.tsx    # Pre-built UI demo
│   │   │   └── custom.tsx      # Headless demo
│   │   ├── _layout.tsx
│   │   └── +not-found.tsx
│   │
│   ├── components/             # ADDED
│   │   └── CustomAuthUI.tsx
│   │
│   ├── config/                 # ADDED
│   │   ├── firebaseConfig.ts
│   │   ├── firebaseConfig.example.ts
│   │   └── authConfig.ts
│   │
│   ├── assets/
│   ├── App.tsx                 # Keep if not using Expo Router
│   ├── app.json
│   ├── package.json
│   └── README.md
│
├── docs/                       # Documentation
│   ├── installation.md
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── error-codes.md
│   └── examples.md
│
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .gitignore
├── README.md                   # Main project README
└── package.json                # Root (if monorepo)
```