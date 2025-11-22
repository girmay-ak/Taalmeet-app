# TaalMeet

A production-ready React Native language exchange app built with **Expo SDK 54**, TypeScript, and Supabase, following clean architecture principles.

## 🚀 Quick Start with Expo Go

### 1. Install Expo Go on Your Phone

- **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Start Development Server

```bash
make start
```

### 3. Scan QR Code

Open Expo Go app → Tap "Scan QR Code" → Point at the QR code in terminal → App loads automatically!

**That's it!** No building, no code signing, just scan and go! 🎉

See [EXPO_GO_SETUP.md](./EXPO_GO_SETUP.md) for detailed instructions.

## 🏗️ Architecture

This project follows **Clean Architecture** principles, ensuring:

- **Separation of Concerns**: Each layer has a single, well-defined responsibility
- **Dependency Inversion**: Core business logic is independent of frameworks
- **Testability**: Easy to test with mocked dependencies
- **Maintainability**: Clear structure and documentation
- **Scalability**: Modular design that grows with your needs
- **Framework Agnostic**: Core logic can be ported to web or other platforms

## 📁 Project Structure

```
/taalmeet-app
├── .github/workflows/    # CI/CD pipelines
├── .husky/               # Git hooks
├── assets/               # Expo assets (icons, splash screens)
├── src/
│   ├── core/            # Core business logic (framework independent)
│   │   ├── entities/    # Business entities/models
│   │   ├── usecases/    # Business use cases
│   │   └── interfaces/  # Abstract interfaces/contracts
│   ├── data/            # Data layer (implementation)
│   │   ├── repositories/# Repository implementations
│   │   ├── datasources/ # Remote & local data sources
│   │   └── models/      # Data models/DTOs
│   ├── presentation/    # UI layer
│   │   ├── screens/     # Screen components
│   │   ├── components/  # Reusable components
│   │   ├── navigation/  # Navigation configuration
│   │   └── hooks/       # Custom React hooks
│   ├── infrastructure/  # External services & frameworks
│   │   ├── database/    # Supabase client & config
│   │   ├── storage/     # AsyncStorage, cache
│   │   ├── notifications/# Push notifications
│   │   └── http/        # API client configuration
│   ├── shared/          # Shared utilities
│   │   ├── constants/   # App constants
│   │   ├── types/       # TypeScript types/interfaces
│   │   ├── utils/       # Helper functions
│   │   └── validators/  # Input validation
│   └── config/          # App configuration
│       ├── env.ts       # Environment variables
│       └── app.config.ts# App-level config
├── __tests__/           # Test files
├── docs/                # Documentation
└── app.json             # Expo configuration
```

## 🛠️ Available Commands

```bash
# Development
make start          # Start Expo dev server (shows QR code)
make ios            # Run on iOS simulator
make android        # Run on Android emulator
make web            # Run on web browser

# Testing
make test           # Run tests
make test-watch     # Run tests in watch mode
make test-coverage  # Run tests with coverage

# Code Quality
make lint           # Run ESLint
make lint-fix       # Fix ESLint issues
make format         # Format code with Prettier
make type-check     # Run TypeScript type checking

# Utilities
make show-ip        # Show local IP for device connection
make kill-port      # Kill process on port 8081
make clean          # Clean build artifacts
make help           # Show all commands
```

## 📝 Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo Go app on your phone (for development)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.development
# Edit .env.development with your Supabase credentials
```

### Running the App

**With Expo Go (Recommended for Development):**
```bash
make start
# Scan QR code with Expo Go app
```

**With Simulator/Emulator:**
```bash
make ios        # iOS simulator
make android    # Android emulator
```

## 🧪 Testing

```bash
# Run all tests
make test

# Run tests in watch mode
make test:watch

# Run tests with coverage
make test:coverage
```

## 📚 Documentation

- [Expo Go Setup Guide](./EXPO_GO_SETUP.md) - Detailed Expo Go instructions
- [Architecture Documentation](./docs/ARCHITECTURE.md) - Architecture decisions
- [API Documentation](./docs/API.md) - API reference
- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [Physical Device Setup](./PHYSICAL_DEVICE_SETUP.md) - Device connection guide

## 🔧 Configuration

### Environment Variables

The app uses environment-specific configuration files:
- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

See `.env.example` for required variables.

### Expo Configuration

Edit `app.json` or `app.config.js` to customize:
- App name, slug, and version
- Icons and splash screens
- Bundle identifiers
- Permissions and plugins

## 🏛️ Architecture Principles

### Design Patterns Used

- **Repository Pattern**: Abstract data access
- **Factory Pattern**: Object creation
- **Singleton Pattern**: Shared instances (DB client)
- **Observer Pattern**: Real-time updates
- **Strategy Pattern**: Interchangeable algorithms (matching)

### SOLID Principles

- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

## 📦 Building for Production

When ready to build standalone apps:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🌿 Branch Strategy (Git Flow)

We follow a Git Flow branching strategy:

```
main (production)
  └── release/v1.x (release candidates)
       └── develop (integration branch)
            ├── feature/* (feature branches)
            ├── bugfix/* (bugfix branches)
            └── hotfix/* (critical production fixes)
```

### Branch Types

- **`main`** - Production-ready code. Only merged from release branches, protected.
- **`staging`** - Pre-production testing environment.
- **`develop`** - Main development branch. All features merge here.
- **`release/v1.x`** - Release candidates. Created from develop, merged to main after testing.
- **`feature/*`** - New features. Created from develop.
- **`bugfix/*`** - Non-critical bug fixes. Created from develop.
- **`hotfix/*`** - Critical production fixes. Created from main, merged to main and develop.

### Branch Protection Rules

- **main**: Requires 2 PR approvals, status checks must pass, no direct commits
- **develop**: Requires 1 PR approval, status checks must pass
- **staging**: Requires 1 PR approval, status checks must pass

## 🤝 Contributing

### Getting Started

1. **Fork the repository** and clone your fork
2. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the code style guidelines

4. **Run tests and linting**:
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

5. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: Add user authentication"
   git commit -m "fix: Resolve login crash on Android"
   git commit -m "docs: Update API documentation"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** to `develop` branch

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (dependencies, config, etc.)
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

### Pull Request Process

1. Ensure your branch is up to date with `develop`
2. Fill out the PR template completely
3. Ensure all CI checks pass
4. Request review from code owners
5. Address review feedback
6. Once approved, your PR will be merged

### Code Review Guidelines

- Be respectful and constructive
- Focus on code quality and maintainability
- Ask questions if something is unclear
- Approve when the code meets standards

## 📄 License

ISC

## 🙏 Acknowledgments

Built with Expo SDK 54, React Native, TypeScript, and Supabase.
