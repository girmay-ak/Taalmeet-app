.PHONY: help install install-ios install-android start ios android test lint format type-check clean reset setup kill-port android-device ios-device show-ip fix-watchman

# Default target
help:
	@echo "TaalMeet - Available commands:"
	@echo ""
	@echo "  make install          - Install all dependencies"
	@echo "  make install-ios      - Install iOS dependencies (CocoaPods)"
	@echo "  make install-android  - Install Android dependencies"
	@echo "  make start            - Start Expo dev server (shows QR code)"
	@echo "  make ios              - Run on iOS simulator"
	@echo "  make android          - Run on Android emulator"
	@echo "  make web              - Run on web browser"
	@echo "  make test             - Run tests"
	@echo "  make test-watch       - Run tests in watch mode"
	@echo "  make test-coverage    - Run tests with coverage"
	@echo "  make lint             - Run ESLint"
	@echo "  make lint-fix         - Fix ESLint issues"
	@echo "  make format           - Format code with Prettier"
	@echo "  make type-check       - Run TypeScript type checking"
	@echo "  make clean            - Clean build artifacts and caches"
	@echo "  make reset            - Reset everything (clean + reinstall)"
	@echo "  make setup            - Initial project setup"
	@echo "  make kill-port        - Kill process on port 8081"
	@echo "  make android-device   - Run on Android physical device"
	@echo "  make ios-device       - Run on iOS physical device"
	@echo "  make show-ip          - Show local IP for device connection"
	@echo "  make fix-watchman     - Fix watchman recrawl warning"
	@echo ""

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install
	@echo "Dependencies installed!"

# Install iOS dependencies
install-ios:
	@echo "Installing iOS dependencies..."
	@if [ -d "ios" ]; then \
		cd ios && pod install && cd ..; \
		echo "iOS dependencies installed!"; \
	else \
		echo "Note: With Expo Go, you don't need iOS native dependencies."; \
		echo "Just scan the QR code with Expo Go app!"; \
	fi

# Install Android dependencies (placeholder - Android doesn't need separate install)
install-android:
	@echo "Note: With Expo Go, you don't need Android native dependencies."
	@echo "Just scan the QR code with Expo Go app!"
	@echo "Make sure Android SDK and emulator are set up if using emulator"

# Start Expo dev server
start:
	@echo "Starting Expo dev server..."
	@if lsof -ti:8081 > /dev/null 2>&1; then \
		echo "Port 8081 is in use. Killing existing process..."; \
		lsof -ti:8081 | xargs kill -9 2>/dev/null || true; \
		sleep 1; \
	fi
	@echo ""
	@echo "=========================================="
	@echo "Expo will show a QR code below"
	@echo "Scan it with Expo Go app on your phone!"
	@echo ""
	@echo "📱 Download Expo Go:"
	@echo "   iOS: https://apps.apple.com/app/expo-go/id982107779"
	@echo "   Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
	@echo ""
	@echo "Then scan the QR code to run the app!"
	@echo "=========================================="
	@echo ""
	npx expo start --clear

# Run on iOS
ios:
	@echo "Running on iOS simulator..."
	npm run ios

# Run on Android
android:
	@echo "Running on Android emulator..."
	npm run android

# Run on web
web:
	@echo "Running on web browser..."
	npm run web

# Run on Android physical device
android-device:
	@echo "Setting up Android device for Expo Go..."
	@echo ""
	@echo "1. Install Expo Go app from Play Store"
	@echo "2. Make sure your phone and computer are on the same WiFi"
	@echo "3. Run 'make start' to see the QR code"
	@echo "4. Open Expo Go app and scan the QR code"
	@echo ""
	@echo "That's it! The app will load on your device."

# Run on iOS physical device
ios-device:
	@echo "Setting up iOS device for Expo Go..."
	@echo ""
	@echo "1. Install Expo Go app from App Store"
	@echo "2. Make sure your phone and computer are on the same WiFi"
	@echo "3. Run 'make start' to see the QR code"
	@echo "4. Open Expo Go app and scan the QR code"
	@echo ""
	@echo "That's it! The app will load on your device."

# Fix watchman recrawl warning
fix-watchman:
	@echo "Fixing watchman recrawl warning..."
	@if command -v watchman > /dev/null 2>&1; then \
		watchman watch-del '/Users/girmay/Documents/Taalmeet-app' 2>/dev/null || true; \
		watchman watch-project '/Users/girmay/Documents/Taalmeet-app' 2>/dev/null || true; \
		echo "Watchman fixed!"; \
	else \
		echo "Watchman not installed. This is optional - Expo will work without it."; \
		echo "Install with: brew install watchman"; \
	fi

# Show local IP address for device connection
show-ip:
	@echo "Your local IP address(es) for device connection:"
	@echo ""
	@if command -v ipconfig > /dev/null 2>&1; then \
		ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Could not determine IP"; \
	elif command -v hostname > /dev/null 2>&1; then \
		hostname -I 2>/dev/null | awk '{print $$1}' || echo "Could not determine IP"; \
	else \
		ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $$2}' | head -1; \
	fi
	@echo ""
	@echo "Use this IP to connect your device to Metro bundler"
	@echo "In Metro bundler, press 'i' for iOS or 'a' for Android"
	@echo "Or manually enter: http://<IP>:8081"

# Run tests
test:
	@echo "Running tests..."
	npm test

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	npm run test:coverage

# Run linter
lint:
	@echo "Running ESLint..."
	npm run lint

# Fix linting issues
lint-fix:
	@echo "Fixing ESLint issues..."
	npm run lint:fix

# Format code
format:
	@echo "Formatting code with Prettier..."
	npm run format

# Type check
type-check:
	@echo "Running TypeScript type check..."
	npm run type-check

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf node_modules/.cache
	rm -rf .expo
	rm -rf .metro
	rm -rf ios/Pods
	rm -rf ios/build
	rm -rf android/build
	rm -rf android/app/build
	rm -rf coverage
	rm -rf .gradle
	@echo "Clean complete!"

# Reset everything
reset: clean
	@echo "Resetting project..."
	npm install
	@if [ -d "ios" ]; then \
		cd ios && pod install && cd ..; \
	fi
	@echo "Reset complete!"

# Kill process on port 8081
kill-port:
	@echo "Killing process on port 8081..."
	@if lsof -ti:8081 > /dev/null 2>&1; then \
		lsof -ti:8081 | xargs kill -9; \
		echo "Process killed!"; \
	else \
		echo "No process found on port 8081"; \
	fi

# Initial setup
setup: install
	@echo "Setting up project..."
	@if [ ! -f ".env.development" ]; then \
		echo "Creating .env.development from .env.example..."; \
		cp .env.example .env.development; \
		echo "Please edit .env.development with your Supabase credentials"; \
	fi
	@if [ -d "ios" ]; then \
		echo "Installing iOS dependencies..."; \
		cd ios && pod install && cd ..; \
	fi
	@echo "Setup complete!"
	@echo "Next steps:"
	@echo "1. Edit .env.development with your Supabase credentials"
	@echo "2. Run 'make ios' or 'make android' to start the app"

