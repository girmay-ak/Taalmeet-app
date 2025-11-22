# Setup Guide

## Prerequisites

Before setting up TaalMeet, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **React Native development environment** set up
  - For iOS: Xcode and CocoaPods
  - For Android: Android Studio and Android SDK
- **Supabase account** and project

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd taalmeet-app

# Install dependencies
npm install
```

### 2. Environment Configuration

Create environment files:

```bash
# Copy example file
cp .env.example .env.development

# Edit with your credentials
nano .env.development
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from project settings
3. Set up database tables (see Database Schema section)

### 4. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 5. Run the App

**iOS**:
```bash
npm run ios
```

**Android**:
```bash
npm run android
```

**Metro Bundler**:
```bash
npm start
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  native_languages TEXT[] NOT NULL,
  learning_languages JSONB NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Matches Table

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) NOT NULL,
  user2_id UUID REFERENCES users(id) NOT NULL,
  user1_teaches TEXT NOT NULL,
  user2_teaches TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code
npm run format
```

### Git Hooks

Husky is configured to run linting and type checking on commit:

- Pre-commit: Runs lint and type-check
- Pre-push: (Can be configured)

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear Metro cache
npm start -- --reset-cache
```

### iOS Build Issues

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
```

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

## Next Steps

1. Set up Supabase database tables
2. Configure authentication (if needed)
3. Implement additional features
4. Set up CI/CD (GitHub Actions already configured)
5. Deploy to app stores

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

